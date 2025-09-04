import { toaster } from "@decky/api";
import {
  Focusable,
  TextField,
  DialogBody,
  ConfirmModal,
} from "@decky/ui";
import { useEffect, useState } from "react";

const AddSaveValueModal: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const storage = "clipboard-values";
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [bOKDisabled, _setBOKDisabled] = useState<boolean>(false);
  const [clipboardValues, setClipboardValues] = useState<string[]>([]);
  
    // Load clipboard values on component mount
    useEffect(() => {
      loadClipboardValues();
    }, []);
    
    const loadClipboardValues = async () => {
      try {
        console.log("Loading clipboard values...");
        setClipboardValues(
          JSON.parse(
            localStorage.getItem(storage) ?? '[]'
          )
        );
      } catch (error) {
        console.error("Error loading clipboard values:", error);
        toaster.toast({
          title: "Error",
          body: "Failed to load saved values"
        });
      }
    };
  
    const saveClipboardValue = async (value: string): Promise<boolean> => {
      setIsLoading(true);

      try {
        localStorage.setItem(
          storage,
          JSON.stringify(
            [...clipboardValues, value]
          )
        );

        setIsLoading(false);
  
        return true;
      } catch (error) {
        console.error("Error saving value:", error);
        toaster.toast({
          title: "Error",
          body: "Failed to save value."
        });

        setIsLoading(false);
  
        return false;
      }
    };
  
    const handleSaveValue = async (value?: string) => {
      if (!value || !value.trim()) return;
  
      setIsLoading(true);
  
      try {
        const success = await saveClipboardValue(value);
        
        if (success) {
          console.error("Success saving value:", value);
  
          await loadClipboardValues();
        }
      } catch (error) {
        console.error("Error saving value:", error);
  
        toaster.toast({
          title: "Error",
          body: "Failed to save value"
        });
      } finally {
        setIsLoading(false);
        closeModal();
      }
    };

  return (
    <ConfirmModal
      strTitle="Save a new value..."
      strDescription="Please enter a new value to save."
      strOKButtonText="Save"
      onOK={() => handleSaveValue(inputValue)}
      onCancel={closeModal}
      bOKDisabled={isLoading || bOKDisabled}
    >
      <DialogBody>
        <Focusable>
          <TextField
            spellCheck="false"
            onChange={(evt) => setInputValue(evt.target.value)}
            onKeyDown={(evt) => {
              if (evt.key === "Enter") {
                handleSaveValue((evt.target as HTMLInputElement).value);
              }
            }}
          />
        </Focusable>
      </DialogBody>
    </ConfirmModal>
  )
}

export default AddSaveValueModal;
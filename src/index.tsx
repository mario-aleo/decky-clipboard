import {
  Button,
  showModal,
  DialogButton,
  PanelSection,
  staticClasses,
  PanelSectionRow,
} from "@decky/ui";
import {
  toaster,
  definePlugin,
} from "@decky/api"
import { useState, useEffect } from "react";
import { FaClipboard, FaTrash } from "react-icons/fa";
import AddSaveValueModal from "./components/AddSaveValueModal";


function Content() {
  const storage = "clipboard-values";
  const [isLoading, setIsLoading] = useState(false);
  const [clipboardValues, setClipboardValues] = useState<string[]>([]);

  // Load clipboard values on component mount
  useEffect(() => {
    loadClipboardValues();
  }, []);

  const closeModal = () => { };

  const loadClipboardValues = async () => {
    setIsLoading(true);

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

    setIsLoading(false);
  };

  const deleteClipboardValue = async (value: string): Promise<boolean> => {
    try {
      localStorage.setItem(storage, JSON.stringify(clipboardValues.filter((v) => v !== value)));
      
      return true;
    } catch (error) {
      console.error("Error deleting value:", error);
      
      return false;
    }
  };

  const handleDeleteValue = async (value: string) => {
    try {
      const success = await deleteClipboardValue(value);

      if (success) {
        console.error("Success deleting value:", value);

        await loadClipboardValues();
      }
    } catch (error) {
      console.error("Error deleting value:", error);
      toaster.toast({
        title: "Error",
        body: "Failed to delete value"
      });
    }
  };

  const handleCopyValue = async (value: string) => {
    try {
      const copySuccess = await copyToClipboardReliable(value);
      
      if (copySuccess) {
        toaster.toast({
          title: "Success",
          body: "Value copied to clipboard"
        });
      } else {
        toaster.toast({
          title: "Error",
          body: "Failed to copy to clipboard"
        });
      }
    } catch (error) {
      console.error("Error copying value:", error);
      toaster.toast({
        title: "Error",
        body: "Failed to copy to clipboard"
      });
    }
  };

  const openAddSaveValueModal = () => {
    showModal(<AddSaveValueModal closeModal={closeModal} />);
  };

  // Reliable clipboard copy function (same as Lossless Scaling plugin)
  const copyToClipboardReliable = async (text: string): Promise<boolean> => {
    // Use the proven input simulation method
    const tempInput = document.createElement('input');
    tempInput.value = text;
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    
    try {
      // Focus and select the text
      tempInput.focus();
      tempInput.select();
      
      // Try the document.execCommand method first (more reliable in gaming mode)
      let copySuccess = document.execCommand('copy');
      
      // If that fails, try the modern clipboard API
      if (!copySuccess) {
        try {
          await navigator.clipboard.writeText(text);
          copySuccess = true;
        } catch (clipboardError) {
          console.error('Both copy methods failed:', copySuccess, clipboardError);
        }
      }
      
      return copySuccess;
    } finally {
      // Clean up
      document.body.removeChild(tempInput);
    }
  };

  return (
    <PanelSection title="Clipboard Manager">
      {/* Input Section */}
      <PanelSectionRow>
          <DialogButton
            style={{
              marginBottom: "16px"
            }}
            onClick={openAddSaveValueModal}
            disabled={isLoading}
          >
            Save a New Value
          </DialogButton>
      </PanelSectionRow>

      {/* Saved Values List */}
      <PanelSectionRow>
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexDirection: "column",
            width: "100%",
            padding: "0",
          }}
        >
          {clipboardValues.length === 0 ? (
            <div style={{  
              padding: "20px", 
              color: "var(--decky-text-color-secondary)",
              fontSize: "14px",
              textAlign: "center",
            }}>
              No saved values yet. Add some text above to get started!
            </div>
          ) : (
            clipboardValues.map((value, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "8px",
                  flex: "1",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "0",
                  borderBottom: index < clipboardValues.length - 1 ? "1px solid var(--decky-border-color)" : "none",
                }}
              >
                <Button
                  style={{
                    display: "flex",
                    gap: "8px",
                    flex: "1",
                    alignItems: "center",
                    maxWidth: "100%",
                    padding: "8px",
                    overflow: "hidden"
                  }}
                  onClick={() => handleCopyValue(value)}
                >
                  <FaClipboard size={12} />
                  <span
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >{value}</span>
                </Button>
                <Button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "auto", 
                    padding: "8px",
                  }}
                  onClick={() => handleDeleteValue(value)}
                >
                  <FaTrash size={12} />
                </Button>
              </div>
            ))
          )}
        </div>
      </PanelSectionRow>
    </PanelSection>
  );
}

export default definePlugin(() => {
  return {
    // The name shown in various decky menus
    name: "Clipboard Manager",
    // The element displayed at the top of your plugin's menu
    titleView: <div className={staticClasses.Title}>Clipboard Manager</div>,
    // The content of your plugin's menu
    content: <Content />,
    // The icon displayed in the plugin list
    icon: <FaClipboard />,
    // The function triggered when your plugin unloads
    onDismount() {
      // Plugin cleanup if needed
    },
  };
});

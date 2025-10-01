import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", variant = "error" }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${variant === "error" ? "bg-error/10" : "bg-warning/10"}`}>
            <ApperIcon 
              name={variant === "error" ? "AlertTriangle" : "AlertCircle"} 
              className={variant === "error" ? "text-error" : "text-warning"} 
              size={24} 
            />
          </div>
          <div className="flex-1">
            <p className="text-slate-700">{message}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant={variant === "error" ? "accent" : "secondary"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={variant === "error" ? "bg-error hover:brightness-110" : ""}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
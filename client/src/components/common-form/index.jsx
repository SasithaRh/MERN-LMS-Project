import { Button } from "../ui/button";
import FormControls from "./form-controls";

function CommonForm({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-2xl shadow-md"
    >
      {/* Render form controls */}
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isButtonDisabled}
        className={`mt-4 w-full py-3 text-sm font-semibold tracking-wide rounded-xl transition-all duration-300
          ${
            isButtonDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-[1.02]"
          }`}
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;

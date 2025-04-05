import { Button, ButtonText } from "@/components/ui/button";
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import React from "react";

// Change the function signature to take props as an object
export default function ToastGlue({ msg }: { msg: string }) {
  const toast = useToast();
  console.log(msg);

  console.log("toast start");
  const [toastId, setToastId] = React.useState(0);
  const handleToast = () => {
    console.log("Toast ID:", toastId);
    if (!toast.isActive(toastId.toString())) {
      console.log("Toast is not active, showing new toast");
      showNewToast();
    }
  };
  const showNewToast = () => {
    console.log("toast two");
    const newId = Math.random();
    setToastId(newId);
    toast.show({
      id: newId.toString(),
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast nativeID={uniqueToastId} action="muted" variant="solid">
            <ToastTitle>Hello!</ToastTitle>
            <ToastDescription>
              This is a customized toast message.
            </ToastDescription>
          </Toast>
        );
      },
    });
  };
  return (
    <Button onPress={handleToast}>
      <ButtonText>Press Me</ButtonText>
    </Button>
  );
}

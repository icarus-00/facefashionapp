import { ActivityIndicator } from "react-native";

export default function ActivitySpinner({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      loading?
      <ActivityIndicator size="large" color="#0000ff" />: {children}
    </>
  );
}

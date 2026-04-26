import { redirect } from "next/navigation";

export default function RootPage() {
  // Mặc định chuyển hướng sang trang lịch giống như bản cũ
  redirect("/calendar");
}

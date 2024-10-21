import VideoChatPage from "@/template/VideoChatPage";

export default function Page({ params }: { params: { roomId: string } }) {
  const { roomId } = params;

  return <VideoChatPage roomId={roomId} />;
}

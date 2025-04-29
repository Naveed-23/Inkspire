import InkRoom from "@/components/InkRoom";

export default async function InkPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = await params;
    console.log("roomId", roomId);
  
    return <InkRoom roomId={roomId} />;
  }
  
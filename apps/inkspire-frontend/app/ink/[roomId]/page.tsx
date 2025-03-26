import InkRoom from "@/components/InkRoom";


export default async function InkPage({params}: {
    params: {
        roomId: string
    }
}){
    const roomId = await params.roomId;
    console.log("roomId", roomId);

    return <InkRoom roomId={roomId} />
}
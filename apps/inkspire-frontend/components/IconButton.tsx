import { ReactNode } from "react";
import { Button } from "./ui/button";

export default function IconButton({ icon, onClick, activated }: {
    icon: ReactNode,
    onClick: () => void,
    activated: boolean
}) {

    return <Button className={`cursor-pointer bg-slate-600 rounded-full hover:bg-gray-400 ${activated ? "text-red-400" : "text-white"}`} onClick={onClick}>{icon}</Button>
}
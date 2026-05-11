import Link from "next/link";

export default function PannelUl(){
    return(
        <div className="pannel-ul-cover">
            <ul className="pannel-ul">
                <li><Link href={'/pannel'}>Rooms</Link></li>
                <li><Link href={'/pannel/create'}>Create</Link></li>
            </ul>
        </div>
    )
}
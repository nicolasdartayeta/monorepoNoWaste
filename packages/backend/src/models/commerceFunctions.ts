import { NewCommerce, commerce} from "@server/db/schema";
import { db } from "@server/db/db";

export async function addCommerce(Commerce :NewCommerce): Promise<boolean>{
    const result = (await db.insert(commerce).values(Commerce).returning());
    if (result){
        return true;
    } else {
        return false;
    }
}
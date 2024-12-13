import { getBlockStatus } from "../gql.server";
import { authenticate } from "../shopify.server"

export const action = async ({
    request, params
}) => {
    try {
        const { admin } = await authenticate.admin(request);


        const blockId = params.blockId;


        const block = await getBlockStatus(admin, blockId);

        return {
            success: block
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            error: error.message
        }
    }
}
import { createOrUpdateAppDataMetafield, getAppInstallationId } from "../gql.server";
import { authenticate } from "../shopify.server"

export const action = async ({
    request
}) => {
    try {
        const { admin } = await authenticate.admin(request);

        const { data } = await request.json();

        const blockId = data.blockId;

        const enable = data.enable;

        const ownerId = await getAppInstallationId(admin);


        const blockData = {
            key: blockId,
            ownerId: ownerId,
            value: enable ? 'true' : 'false'

        }

        const block = await createOrUpdateAppDataMetafield(admin, blockData);

        console.log(blockId, enable, block);

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
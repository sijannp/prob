import { getBlockStatus } from "../gql.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    try {
        const { admin } = await authenticate.admin(request);

        const blocks = [
            "payment_icons",
            "product_reviews"
        ];

        // Get block status of each and combine them into a single object
        const blockStatus = await blocks.reduce(async (accPromise, blockId) => {
            const acc = await accPromise;
            const status = await getBlockStatus(admin, blockId);
            acc[blockId] = status;
            return acc;
        }, Promise.resolve({}));

        return {
            success: true,
            data: blockStatus
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            error: error.message
        };
    }
};

import {
  BlockStack,
  Button,
  Card,
  InlineGrid,
  Page,
  Text,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  return null;
};

const Index = () => {
  const statusFetcher = useFetcher();
  const [enabledBlocks, setEnabledBlocks] = useState([]);
  const toggleFetcher = useFetcher();

  const APP_BLOCKS = [
    {
      name: "Payment Icons",
      id: "payment_icons",
      description: "Show payment icons in the product page.",
      enabled: true,
    },
    {
      name: "Product Reviews",
      id: "product_reviews",
      description: "Show product reviews in the product page.",
      enabled: true,
    },
  ];

  useEffect(() => {
    statusFetcher.load(`/api/bulk/status`);
  }, []);

  useEffect(() => {
    if (statusFetcher.data) {
      const data = statusFetcher.data?.data || {};
      const enabledBlocks = Object.entries(data)
        .filter(([_, value]) => value)
        .map(([key, _]) => key);
      setEnabledBlocks(enabledBlocks);
    }
  }, [statusFetcher.data]);

  const onStatusToggle = async (blockId, enable) => {
    const data = {
      blockId,
      enable,
    };

    console.log(data);
    await toggleFetcher.submit(
      {
        data: data,
      },
      {
        method: "POST",
        action: `/api/block/toggle`,
        encType: "application/json",
      },
    );
  };

  useEffect(() => {
    if (toggleFetcher.data) {
      const success = toggleFetcher.data?.success;
      if (success) {
        statusFetcher.load(`/api/bulk/status`);
      }
    }
  }, [toggleFetcher.data]);

  return (
    <Page title="Home">
      <InlineGrid columns={2} gap={400}>
        {APP_BLOCKS.map((block) => (
          <Card key={block.id}>
            <BlockStack gap={300}>
              <Text variant="headingMd">{block.name}</Text>
              <Text>{block.description}</Text>
              <Text>{`Status: ${
                enabledBlocks.includes(block.id) ? "Enabled" : "Disabled"
              }
              `}</Text>
            </BlockStack>

            <Button
              onClick={() =>
                onStatusToggle(block.id, !enabledBlocks.includes(block.id))
              }
            >
              {enabledBlocks.includes(block.id) ? "Disable" : "Enable"}
            </Button>
          </Card>
        ))}
      </InlineGrid>
    </Page>
  );
};

export default Index;

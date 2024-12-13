
export async function getAppInstallationId(admin) {

  const query = `
    query {
      currentAppInstallation {
        id
      }
    }
  `;

  const response = await admin.graphql(query);
  const { data } = await response.json();

  if (data?.currentAppInstallation?.id) {
    return data.currentAppInstallation.id;
  } else {
    throw new Error('App Installation ID not found.');
  }
}


export async function createOrUpdateAppDataMetafield(admin, metafieldDetails) {
  console.log("Creating metafield with ------> ", metafieldDetails);
  try {
    const response = await admin.graphql(
      `#graphql
  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
      id
      namespace
      key
    }
    userErrors {
      field
      message
    }
    }
  }`,
      {
        variables: {
          "metafields": [
            {
              "key": metafieldDetails.key,
              "namespace": "enabled_blocks",
              "ownerId": metafieldDetails.ownerId,
              "type": "boolean",
              "value": metafieldDetails.value
            }
          ]
        },
      },
    );


    const { data } = await response.json();

    console.log(data.metafieldsSet, "------->DATA")


    if (data?.metafieldsSet?.metafields) {
      // return data.metafieldsSet.metafields[0];
      return true
    } else {
      throw new Error('Failed to create or update app-data metafield.');
    }

  } catch (error) {
    console.error(error);
    return false;
  }

}



export async function toggleBlockStatus(admin, blockName, enable) {
  const appInstallationId = await getAppInstallationId(admin);

  const metafieldDetails = {
    key: blockName,
    value: enable?.toString() || 'false',
    ownerId: appInstallationId,
  };

  return await createOrUpdateAppDataMetafield(admin, metafieldDetails);
}



export async function getBlockStatus(admin, blockName) {
  try {
    const response = await admin.graphql(
      `#graphql
        query getAppMetafield($blockName: String!) {
          app {
          installation {
          metafield(key: $blockName){
            id
            value
      }
    }
  }
        }`,
      {
        variables: {
          blockName: `enabled_blocks.${blockName}`,
        },
      }
    );

    const { data } = await response.json();

    console.log(data, "------->DATA", blockName)

    const metafield = data?.app?.installation?.metafield
    return metafield ? metafield.value === 'true' : false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

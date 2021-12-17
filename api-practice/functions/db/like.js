const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const addLike = async (client, userId, likeItemId, likeItemTypeId) => {
  const { rows: existingRows } = await client.query(
    `
    SELECT FROM "like"
    WHERE user_id = $1
      AND like_item_id = $2
      AND like_item_type_id = $3
    `,
    [userId, likeItemId, likeItemTypeId],
  );

  if (existingRows.length !== 0) return false;

  const { rows } = await client.query(
    `
    INSERT INTO "like"
    (user_id, like_item_id, like_item_type_id)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `,
    [userId, likeItemId, likeItemTypeId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const toggleLike = async (client, userId, likeItemId, likeItemTypeId) => {
  const { rows } = await client.query(
    `
    UPDATE "like"
    SET is_deleted = NOT is_deleted
    WHERE user_id = $1
      AND like_item_id = $2
      AND like_item_type_id = $3
    RETURNING *
    `,
    [userId, likeItemId, likeItemTypeId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const getLikesByLikeItemIds = async (client, likeItemIds, likeItemTypeId) => {
  if (likeItemIds.length < 1) return [];

  const { rows } = await client.query(
    `
    SELECT * FROM "like"
    WHERE like_item_id IN (${likeItemIds.join()}) 
      AND is_deleted = FALSE
      AND like_item_type_id = $1
    `,
    [likeItemTypeId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { addLike, toggleLike, getLikesByLikeItemIds };

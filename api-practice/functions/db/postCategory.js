const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const getAllPostCategories = async (client) => {
  const { rows } = await client.query(
    `
    SELECT * FROM post_category
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getPostCategoryById = async (client, postCategoryId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM post_category
    WHERE id = $1
    `,
    [postCategoryId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const getPostCategoryByIds = async (client, postCategoryIds) => {
  if (postCategoryIds.length < 1) return [];

  const { rows } = await client.query(
    `
    SELECT * FROM post_category
    WHERE id IN (${postCategoryIds.join()})
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { getAllPostCategories, getPostCategoryById, getPostCategoryByIds };

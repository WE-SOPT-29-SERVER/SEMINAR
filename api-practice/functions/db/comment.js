const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const addComment = async (client, postId, userId, content, color, isSecret = false, commentId) => {
  const { rows } = await client.query(
    `
    INSERT INTO comment
    (post_id, user_id, content, color, is_secret, comment_id)
    VALUES
    ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [postId, userId, content, color, isSecret, commentId],
  );

  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const getCommentById = async (client, commentId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM comment
    WHERE id = $1
    `,
    [commentId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const getCommentsByPostId = async (client, postId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM comment
    WHERE post_id = $1
      AND is_deleted = FALSE
    `,
    [postId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const updateComment = async (client, commentId, content, color) => {
  const { rows: existingRows } = await client.query(
    `
    SELECT * FROM comment
    WHERE id = $1
      AND is_deleted = FALSE
    `,

    [commentId],
  );

  if (existingRows.length === 0) return false;

  const data = _.merge({}, convertSnakeToCamel.keysToCamel(existingRows[0]), { content, color });

  const { rows } = await client.query(
    `
    UPDATE comment
    SET content = $1, color = $2, updated_at = now()
    WHERE id = $3
      AND is_deleted = FALSE
    RETURNING *
    `,
    [data.content, data.color, commentId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const deleteComment = async (client, commentId) => {
  const { rows } = await client.query(
    `
    UPDATE comment
    SET is_deleted = true, updated_at = now()
    WHERE id = $1
    RETURNING *
    `,
    [commentId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

module.exports = { addComment, getCommentById, getCommentsByPostId, updateComment, deleteComment };

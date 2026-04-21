/**
 * Groups a flat list of categories by their group_name.
 * @param {Array} categories - Array of category objects from the API.
 * @returns {Object} An object where keys are group names and values are arrays of categories.
 */
export function groupCategories(categories) {
  if (!Array.isArray(categories)) return {};

  return categories.reduce((groups, category) => {
    const groupName = category.group_name || 'Other';
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(category);
    return groups;
  }, {});
}

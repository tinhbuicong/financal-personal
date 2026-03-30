import api from "../../../services/api.service";

export interface CategoryMapping {
  id?: number;
  category_name: string;
  group_name: string;
}

export const categoryService = {
  getMappings: async (): Promise<CategoryMapping[]> => {
    return api.get("/category-mappings");
  },

  updateMapping: async (mapping: CategoryMapping): Promise<CategoryMapping> => {
    return api.put("/category-mappings", mapping);
  },

  deleteMapping: async (id: number): Promise<void> => {
    return api.delete(`/category-mappings/${id}`);
  },
};

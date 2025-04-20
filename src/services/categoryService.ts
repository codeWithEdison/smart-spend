
import { supabase } from '@/lib/supabase';
import { Category } from '@/context/BudgetContext';

// Fetch categories for current user
export const fetchCategories = async () => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.user.id)
      .order('name', { ascending: true });

    if (error) throw error;
    
    return data as unknown as Category[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Add new category
export const addCategory = async (category: Omit<Category, 'id'>) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([{ ...category, user_id: user.user.id }])
      .select()
      .single();

    if (error) throw error;
    
    return data as unknown as Category;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Update category
export const updateCategory = async (category: Category) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', category.id)
      .eq('user_id', user.user.id)
      .select()
      .single();

    if (error) throw error;
    
    return data as unknown as Category;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Delete category
export const deleteCategory = async (id: string) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.user.id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

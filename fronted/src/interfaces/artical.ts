interface ArticalItem {
  title: string,
  subTitle?: string,
  introduction?: string,
  content?: string,
  createDate?: string,
  updateDate?: string,
  author: string,
  authorId: number,
  category: string,
  categoryId: number,
  articalId?: number
}

interface CategoryItem {
  categoryName?: string,
  categoryDesc?: string,
  categoryId?: number
}


export { ArticalItem, CategoryItem }
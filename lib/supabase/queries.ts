// Data fetching utilities for Supabase tables
import { supabase } from './client'
import type {
  AboutUs,
  Blog,
  Book,
  BookCategory,
  BookKnowledge,
  Chatbot,
  Comment,
  ContactSubmission,
  FAQ,
  PageContent,
  PublicUser,
  Request,
  SEOMetadata,
  SiteSettings,
  TeamMember,
  Thread,
  Tool,
} from './types'

// ==================== BLOGS ====================
export async function getBlogs(limit?: number, featured?: boolean) {
  // Step 1: Fetch blogs (simple query, no join)
  let query = supabase
    .from('blogs')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (featured) {
    query = query.eq('is_featured', true)
  }

  if (limit) {
    query = query.limit(limit)
  }

  const { data: blogsData, error: blogsError } = await query
  
  if (blogsError || !blogsData) {
    return { data: blogsData?.map((blog: any) => ({ ...blog, author: null })) as Blog[] | null, error: blogsError }
  }

  // Step 2: Get all unique user_ids from blogs
  const userIds = [...new Set(blogsData.filter((blog: any) => blog.user_id).map((blog: any) => blog.user_id))]
  
  // Step 3: Fetch authors from public_users table
  let authorsMap: Record<string, any> = {}
  
  if (userIds.length > 0) {
    // Query public_users by id (blogs.user_id should match public_users.id)
    const { data: authorsData } = await supabase
      .from('public_users')
      .select('id, full_name, avatar_url, email')
      .in('id', userIds)
    
    if (authorsData && authorsData.length > 0) {
      authorsData.forEach(author => {
        authorsMap[author.id] = {
          id: author.id,
          full_name: author.full_name,
          avatar_url: author.avatar_url,
          email: author.email,
        }
      })
    } else {
      // If not found by id, try by user_id field (in case blogs.user_id references public_users.user_id)
      const { data: altAuthorsData } = await supabase
        .from('public_users')
        .select('id, full_name, avatar_url, email, user_id')
        .in('user_id', userIds)
      
      if (altAuthorsData && altAuthorsData.length > 0) {
        altAuthorsData.forEach(author => {
          authorsMap[author.user_id] = {
            id: author.id,
            full_name: author.full_name,
            avatar_url: author.avatar_url,
            email: author.email,
          }
        })
      }
    }
  }

  // Step 4: Combine blogs with their authors
  const blogsWithAuthors = blogsData.map((blog: any) => ({
    ...blog,
    author: blog.user_id && authorsMap[blog.user_id] ? authorsMap[blog.user_id] : null,
  })) as Blog[]

  return { data: blogsWithAuthors, error: null }
}

export async function getBlogBySlug(slug: string) {
  // Step 1: Fetch blog
  const { data: blogData, error: blogError } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (blogError || !blogData) {
    return { data: null, error: blogError }
  }

  // Step 2: Fetch author from public_users if user_id exists
  let author = null
  
  if (blogData.user_id) {
    // Try by id first (blogs.user_id -> public_users.id)
    const { data: authorData } = await supabase
      .from('public_users')
      .select('id, full_name, avatar_url, email')
      .eq('id', blogData.user_id)
      .single()

    if (authorData) {
      author = {
        id: authorData.id,
        full_name: authorData.full_name,
        avatar_url: authorData.avatar_url,
        email: authorData.email,
      }
    } else {
      // Try by user_id field (blogs.user_id -> public_users.user_id)
      const { data: altAuthorData } = await supabase
        .from('public_users')
        .select('id, full_name, avatar_url, email')
        .eq('user_id', blogData.user_id)
        .single()

      if (altAuthorData) {
        author = {
          id: altAuthorData.id,
          full_name: altAuthorData.full_name,
          avatar_url: altAuthorData.avatar_url,
          email: altAuthorData.email,
        }
      }
    }
  }

  return { 
    data: { ...blogData, author } as Blog, 
    error: null 
  }
}

// ==================== BOOKS ====================
export async function getBooks(limit?: number, categoryId?: string, featured?: boolean) {
  let query = supabase
    .from('books')
    .select('*, book_categories(name)')
    .order('created_at', { ascending: false })

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  if (featured) {
    query = query.eq('is_featured', true)
  }

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  return { data: data as (Book & { book_categories: { name: string } | null })[] | null, error }
}

export async function getBookById(id: string) {
  const { data, error } = await supabase
    .from('books')
    .select('*, book_categories(name)')
    .eq('id', id)
    .single()

  return { data: data as (Book & { book_categories: { name: string } | null }) | null, error }
}

export async function getBookCategories() {
  const { data, error } = await supabase
    .from('book_categories')
    .select('*')
    .order('name', { ascending: true })

  return { data: data as BookCategory[] | null, error }
}

// ==================== THREADS ====================
export async function getThreads(limit?: number, featured?: boolean) {
  let query = supabase
    .from('threads')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (featured) {
    query = query.eq('is_featured', true)
  }

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  return { data: data as Thread[] | null, error }
}

export async function getThreadBySlug(slug: string) {
  const { data, error } = await supabase
    .from('threads')
    .select('*')
    .eq('slug', slug)
    .eq('is_approved', true)
    .single()

  return { data: data as Thread | null, error }
}

export async function getThreadComments(threadId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('thread_id', threadId)
    .eq('is_approved', true)
    .order('created_at', { ascending: true })

  return { data: data as Comment[] | null, error }
}

// ==================== TOOLS ====================
export async function getTools(limit?: number, category?: string) {
  let query = supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  return { data: data as Tool[] | null, error }
}

export async function getToolBySlug(slug: string) {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .single()

  return { data: data as Tool | null, error }
}

export async function getToolCategories() {
  const { data, error } = await supabase
    .from('tools')
    .select('category')
    .not('category', 'is', null)

  if (error) {
    return { data: null, error }
  }

  // Extract unique categories
  const uniqueCategories = Array.from(
    new Set(data.map((tool) => tool.category).filter(Boolean))
  ).map((category) => ({
    id: category as string,
    name: category as string,
  }))

  return { data: uniqueCategories, error: null }
}

// ==================== FAQS ====================
export async function getFAQs() {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('display_order', { ascending: true })

  return { data: data as FAQ[] | null, error }
}

// ==================== TEAM MEMBERS ====================
export async function getTeamMembers() {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true })

  return { data: data as TeamMember[] | null, error }
}

// ==================== SITE SETTINGS ====================
export async function getSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single()

  return { data: data as SiteSettings | null, error }
}

// ==================== PAGE CONTENT ====================
export async function getPageContent(slug: string) {
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('page_slug', slug)
    .single()

  return { data: data as PageContent | null, error }
}

// ==================== SEO METADATA ====================
export async function getSEOMetadata(slug: string) {
  const { data, error } = await supabase
    .from('seo_metadata')
    .select('*')
    .eq('page_slug', slug)
    .single()

  return { data: data as SEOMetadata | null, error }
}

// ==================== ABOUT US ====================
export async function getAboutUs() {
  const { data, error } = await supabase
    .from('about_us')
    .select('*')
    .limit(1)
    .single()

  return { data: data as AboutUs | null, error }
}

// ==================== CONTACT SUBMISSIONS ====================
export async function submitContactForm(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert([
      {
        name,
        email,
        subject,
        message,
        status: 'new' as const,
      },
    ] as any)
    .select()
    .single()

  return { data: data as ContactSubmission | null, error }
}

// ==================== CHATBOTS ====================
export async function getChatbotByBookId(bookId: string) {
  const { data, error } = await supabase
    .from('chatbots')
    .select('*')
    .eq('linked_book_id', bookId)
    .single()

  return { data: data as Chatbot | null, error }
}

// ==================== REQUESTS ====================
export async function submitRequest(
  type: 'book' | 'tool' | 'other',
  title: string,
  description: string,
  userName?: string,
  userEmail?: string
) {
  const { data, error } = await supabase
    .from('requests')
    .insert([
      {
        type,
        title,
        description,
        user_name: userName || null,
        user_email: userEmail || null,
        status: 'pending' as const,
      },
    ] as any)
    .select()
    .single()

  return { data: data as Request | null, error }
}


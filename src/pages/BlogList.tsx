import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBlogPosts } from '@/hooks/useBlog';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { normalizeMediaUrl } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, User, Search, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const { posts, isLoading } = useBlogPosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  const publishedPosts = posts.filter((post: any) => post.is_published);
  
  // Extract categories
  const categories = ['All', ...Array.from(new Set(publishedPosts.map((p: any) => p.category?.name).filter(Boolean)))];

  const filteredPosts = publishedPosts.filter((post: any) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500"
            >
              Blog & Artikel
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Berbagi pengetahuan, pengalaman, dan pandangan seputar dunia teknologi.
            </motion.p>
          </div>

          {/* Search and Filter */}
          <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between max-w-5xl mx-auto">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
              {categories.map((category: any) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer whitespace-nowrap px-4 py-2"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto">
              {currentPosts.map((post: any, index: number) => (
                <div key={post.id} className="relative group">
                  {/* Neon Glow Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500 group-hover:duration-200 animate-tilt"></div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative h-full bg-card rounded-xl overflow-hidden border hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col z-10"
                  >
                    <Link to={`/blog/${post.slug}`} className="relative aspect-video overflow-hidden block">
                      <img
                        src={post.coverImage || post.coverImageFile ? normalizeMediaUrl(post.coverImage || post.coverImageFile) : "https://placehold.co/600x400?text=Blog+Post"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://placehold.co/600x400?text=Blog+Post";
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary/90 text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]">
                          {post.category?.name || 'Article'}
                        </span>
                      </div>
                    </Link>

                    <div className="p-5 flex-grow flex flex-col">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(post.created_at), 'd MMM yyyy', { locale: id })}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        <Link to={`/blog/${post.slug}`} className="hover:underline decoration-primary/50 underline-offset-4">
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                        {post.excerpt}
                      </p>

                      <Link 
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center text-primary text-sm font-medium hover:underline mt-auto group/link"
                      >
                        Baca Selengkapnya <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-secondary transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-4 py-2 border rounded-md transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'hover:bg-secondary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-secondary transition-colors"
                >
                  Next
                </button>
              </div>
            )}
            </>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold mb-2">Tidak ada artikel ditemukan</h3>
              <p className="text-muted-foreground">Coba kata kunci pencarian lain atau kategori berbeda.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogList;

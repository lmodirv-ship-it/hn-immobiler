import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { blogPosts } from '@/lib/blog-data';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Blog = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
          <span className="text-gradient-cyber">Blog</span>{' '}
          <span className="text-foreground">HN Immobilier</span>
        </h1>
        <p className="text-muted-foreground mt-3">
          {isFr
            ? 'Actualités, guides et conseils sur l\'immobilier au Maroc'
            : 'أخبار ودلائل ونصائح حول العقارات في المغرب'
          }
        </p>
      </motion.div>

      {/* Featured post */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link to={`/blog/${blogPosts[0].id}`}>
          <div className="group glass rounded-2xl overflow-hidden glow-border hover:glow-primary transition-all duration-500 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                <img
                  src={blogPosts[0].image}
                  alt={isFr ? blogPosts[0].title : blogPosts[0].titleAr}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 md:p-10 flex flex-col justify-center">
                <Badge className="w-fit bg-primary/10 text-primary border border-primary/20 mb-4">
                  {isFr ? blogPosts[0].category : blogPosts[0].categoryAr}
                </Badge>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3 tracking-tight">
                  {isFr ? blogPosts[0].title : blogPosts[0].titleAr}
                </h2>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {isFr ? blogPosts[0].excerpt : blogPosts[0].excerptAr}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{blogPosts[0].date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{blogPosts[0].readTime} min</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.slice(1).map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={`/blog/${post.id}`}>
              <div className="group glass rounded-xl overflow-hidden glow-border hover:glow-primary transition-all duration-500 h-full flex flex-col">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={isFr ? post.title : post.titleAr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-accent/20 text-accent border border-accent/30 backdrop-blur-md">
                    {isFr ? post.category : post.categoryAr}
                  </Badge>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {isFr ? post.title : post.titleAr}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                    {isFr ? post.excerpt : post.excerptAr}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime} min</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Blog;

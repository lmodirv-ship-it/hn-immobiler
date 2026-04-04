import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { blogPosts } from '@/lib/blog-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

const BlogPost = () => {
  const { id } = useParams();
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="container py-16 text-center">
        <p className="text-xl text-muted-foreground">
          {isFr ? 'Article introuvable' : 'المقال غير موجود'}
        </p>
        <Link to="/blog">
          <Button variant="outline" className="mt-4 glow-border">Blog</Button>
        </Link>
      </div>
    );
  }

  const title = isFr ? post.title : post.titleAr;
  const content = isFr ? post.content : post.contentAr;
  const category = isFr ? post.category : post.categoryAr;

  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="font-display text-lg font-bold text-primary mt-8 mb-3 tracking-tight">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\*\s*:\s*(.*)/);
        if (match) {
          return (
            <li key={i} className="mb-2 text-muted-foreground list-none">
              <span className="text-foreground font-semibold">{match[1]}</span> : {match[2]}
            </li>
          );
        }
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="mb-1 text-muted-foreground ml-4">{line.replace('- ', '')}</li>;
      }
      if (line.match(/^\d+\.\s/)) {
        return <li key={i} className="mb-2 text-muted-foreground ml-4 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-muted-foreground leading-relaxed mb-3">{line}</p>;
    });
  };

  return (
    <div className="container py-10 max-w-4xl">
      <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        {isFr ? 'Retour au blog' : 'العودة إلى المدونة'}
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Hero image */}
        <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-8 glow-border">
          <img src={post.image} alt={title} className="w-full h-full object-cover" />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge className="bg-primary/10 text-primary border border-primary/20">{category}</Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />{post.date}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />{post.readTime} min
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5" />{post.author}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 tracking-tight leading-tight">
          {title}
        </h1>

        {/* Content */}
        <div className="glass rounded-2xl p-6 md:p-10 glow-border">
          {renderContent(content)}
        </div>

        {/* Related */}
        <div className="mt-12">
          <h3 className="font-display text-lg font-bold text-foreground mb-6 tracking-tight">
            {isFr ? 'Articles similaires' : 'مقالات مشابهة'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogPosts.filter((p) => p.id !== post.id).slice(0, 2).map((related) => (
              <Link key={related.id} to={`/blog/${related.id}`}>
                <div className="glass rounded-xl p-4 glow-border hover:glow-primary transition-all duration-300 flex gap-4">
                  <img
                    src={related.image}
                    alt={isFr ? related.title : related.titleAr}
                    className="w-20 h-20 rounded-lg object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm line-clamp-2 hover:text-primary transition-colors">
                      {isFr ? related.title : related.titleAr}
                    </h4>
                    <span className="text-xs text-muted-foreground mt-1 block">{related.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.article>
    </div>
  );
};

export default BlogPost;

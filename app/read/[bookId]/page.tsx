import { getBookBySlug, getBooks } from '@/lib/supabase/queries';
import { notFound, redirect } from 'next/navigation';
import PDFViewerWrapper from '@/components/PDFViewerWrapper';
import { createClient } from '@/lib/supabase/server-client';

export default async function BookPage({ params }: { params: Promise<{ bookId: string }> }) {
    const { bookId } = await params;
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect(`/login?next=/read/${bookId}`);
    }

    // Fetch book details
    const { data: book, error } = await getBookBySlug(bookId);

    if (error || !book) {
        notFound();
    }

    // Fetch other books for the sidebar (fetch more to randomize)
    const { data: allBooks } = await getBooks(20);
    // Randomize and pick 5
    const sidebarBooks = allBooks
        ?.filter(b => b.id !== book.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 5) || [];

    // Construct Cloudflare Worker URL
    const WORKER_DOMAIN = "https://pdf-streamer.qazihassaan96.workers.dev";
    let pdfFilename = book.r2_storage_key;

    if (!pdfFilename) {
        if (book.pdf_url) {
            const parts = book.pdf_url.split('/');
            const lastPart = parts[parts.length - 1];
            pdfFilename = lastPart.endsWith('.pdf') ? lastPart : `${lastPart}.pdf`;
        } else {
            pdfFilename = `${bookId}.pdf`;
        }
    }

    const pdfUrl = `${WORKER_DOMAIN}/${pdfFilename}`;

    return (
        <main className="min-h-screen bg-background flex flex-col">
            {/* Smaller Hero Section */}
            <div className="relative h-[300px] md:h-[200px] shrink-0 overflow-hidden border-b border-border flex items-center justify-center">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

                {/* Centered Content */}
                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-2 md:mt-8">
                    <h1 className="text-xl md:text-5xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg leading-tight line-clamp-2">
                        {book.title}
                    </h1>
                    {book.author && (
                        <p className="text-sm md:text-xl text-emerald-100/90 font-light flex items-center justify-center gap-2 md:gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                            {book.author}
                        </p>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 flex flex-col gap-6">

                {/* Back Button (Moved to Content Section) */}
                <div>
                    <a
                        href={`/books/${book.slug || book.id}`}
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                    >
                        ← Back to Book Details
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">

                    {/* Left Column: PDF Reader (3/4 width) */}
                    <div className="lg:col-span-3 h-[85vh] bg-slate-950 rounded-xl border border-border shadow-2xl relative z-10">
                        <PDFViewerWrapper fileUrl={pdfUrl} />
                    </div>

                    {/* Right Column: Other Books (1/4 width) - Hidden on Mobile */}
                    <div className="hidden lg:block lg:col-span-1 space-y-6">
                        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                            Other Books
                        </h3>
                        <div className="flex flex-col gap-4">
                            {sidebarBooks.map((relatedBook) => (
                                <a
                                    key={relatedBook.id}
                                    href={`/books/${relatedBook.slug || relatedBook.id}`}
                                    className="group flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    {/* Small Icon Size Image */}
                                    <div className="relative w-12 h-16 shrink-0 rounded overflow-hidden bg-muted border border-border">
                                        {relatedBook.cover_image ? (
                                            <img
                                                src={relatedBook.cover_image}
                                                alt={relatedBook.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                                No Cover
                                            </div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <div className="pt-1">
                                        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                            {relatedBook.title}
                                        </h4>
                                        {relatedBook.author && (
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                {relatedBook.author}
                                            </p>
                                        )}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}

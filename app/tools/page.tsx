import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { pdfTools, toolCategories } from '@/lib/config/tools';

export default function AllToolsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="border-b bg-muted/30 py-12 md:py-16">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                All PDF Tools
              </h1>
              <p className="text-lg text-muted-foreground">
                Complete collection of professional PDF tools. All free, all fast, all private.
              </p>
            </div>
          </div>
        </section>

        {toolCategories.map((category) => {
          const categoryTools = pdfTools.filter((tool) => tool.category === category.id);
          
          return (
            <section key={category.id} className="border-b py-12 md:py-16">
              <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                  <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                    {category.name}
                  </h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Card key={tool.id} className="group transition-all hover:shadow-lg">
                        <CardContent className="p-6">
                          <Link href={tool.href} className="flex flex-col gap-3">
                            <div className={`inline-flex size-12 items-center justify-center rounded-xl ${tool.color}`}>
                              <Icon className="size-6" />
                            </div>
                            <div>
                              <div className="mb-1 flex items-center justify-between">
                                <h3 className="font-semibold group-hover:text-primary">
                                  {tool.name}
                                </h3>
                                <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {tool.description}
                              </p>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </main>
      
      <Footer />
    </div>
  );
}

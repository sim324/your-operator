import Heading1, { Subheading } from "@/components/blocks/text";
import WebBlock from "@/components/blocks/web-block";
import CtaButtonBook from "@/components/site/cta-button-book";
import CtaButtonTry from "@/components/site/cta-button-try";

function Quote({ quote, by }: { quote: string; by: string }) {
  return (
    <figure className="flex flex-col gap-4">
      <blockquote className="text-2xl/snug font-bold text-pretty md:text-4xl/tight">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="text-muted-foreground">{by}</figcaption>
    </figure>
  );
}

export default function HomePage() {
  return (
    <div>
      <WebBlock>
        <div className="flex w-full flex-col gap-12">
          <div className="@container flex w-full flex-col gap-6 text-center sm:text-left">
            <Heading1 className="md:text-100cqw md:whitespace-nowrap">
              AI Growth Systems
            </Heading1>
            <Subheading>
              For businesses that sell and deliver through conversations.
            </Subheading>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <CtaButtonBook className="sm:w-fit" />
              <CtaButtonTry className="sm:w-fit" />
            </div>
          </div>

          {/* Case study */}
          <section className="flex w-full flex-col gap-10 rounded-4xl p-6 ring-1 ring-foreground sm:p-10 md:p-14 dark:ring-border">
            <Quote
              quote="This is kind of state of the art use of AI… We're basically using AI to simulate Kyle's brain."
              by="Liron, CEO"
            />

            {/* Context lines are italic, so they read as narration between
                the quotes. */}
            <p className="text-xl text-pretty italic md:text-2xl pl-8 mb-8">
              → Kyle is responsible for the performance of 70+ coaches.
            </p>
            <Quote
              quote="...98, 99% of the AI Coaching aligned with exactly what I'd say."
              by="Kyle, Head of Coaching"
            />
            <p className="text-xl text-pretty italic md:text-2xl pl-8 mb-8">
              → Your Operator designed and built three custom AI tools to scale
              Kyle&apos;s impact.
            </p>
            <Quote
              quote="You hear about companies benefiting from AI… It feels like we're getting a little piece of the pie."
              by="Liron, CEO"
            />
            <p className="text-xl text-pretty italic md:text-2xl pl-8 mb-8">
              → Your Operator specializes in AI Transformations.
            </p>
            <Quote
              quote="[Our business is] growing 25% per year."
              by="Liron, CEO"
            />
          </section>
        </div>
      </WebBlock>
    </div>
  );
}

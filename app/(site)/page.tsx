import Heading1, { Subheading } from "@/components/blocks/text";
import WebBlock from "@/components/blocks/web-block";
import CtaButtonBook from "@/components/site/cta-button-book";
import CtaButtonTry from "@/components/site/cta-button-try";

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
          <div className="aspect-square sm:aspect-video w-full bg-muted rounded-4xl ring-1 dark:ring-0" />
        </div>
      </WebBlock>
    </div>
  );
}

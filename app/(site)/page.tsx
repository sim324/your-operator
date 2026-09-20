import Heading1, { Subheading } from "@/components/blocks/text";
import WebBlock from "@/components/blocks/web-block";
import CtaButtonBook from "@/components/site/cta-button-book";
import CtaButtonTry from "@/components/site/cta-button-try";

export default function HomePage() {
  return (
    <div>
      <WebBlock>
        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
          <div className="flex flex-col gap-6">
            <Heading1>AI Growth Systems</Heading1>
            <Subheading className="text-pretty sm:text-4xl">
              For businesses that sell and deliver through conversations.
            </Subheading>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <CtaButtonBook className="w-fit" />
              <CtaButtonTry className="w-fit" />
            </div>
          </div>
          <div className="aspect-video w-full bg-muted rounded-4xl" />
        </div>
      </WebBlock>
    </div>
  );
}

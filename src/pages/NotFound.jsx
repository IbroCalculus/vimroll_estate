import { PageMeta } from '../components/common/PageMeta';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { PageTransition } from '../components/animations/PageTransition';

export default function NotFound() {
  return (
    <PageTransition>
      <PageMeta title="Page Not Found" />
      <section className="pt-36 pb-24 sm:pt-44 sm:pb-32">
        <Container className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B69A69]">
            404 — Address Not Found
          </p>
          <h1 className="mx-auto mt-4 max-w-xl font-serif text-4xl font-normal text-[#171816] sm:text-6xl">
            This Page Is Beyond Our Current Map.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#41413D] sm:text-base">
            The address you entered may have moved or no longer exists. Explore our
            international portfolio or return to the VIMROLL Estate homepage.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button variant="primary" to="/">
              Return Home
            </Button>
            <Button variant="outline" to="/properties">
              Explore Properties
            </Button>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}


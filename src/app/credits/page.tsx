import ExternalLink from '@/components/ExternalLink';
import { Label } from '@/components/ui/label';

export default function Credits() {
  return (
    <div className="container mt-16 md:mt-32 text-center">
      <h1 className="text-3xl text-center">Credits / Attribution</h1>
      <ul className="mt-16 text-base font-thin">
        <li>
          <Label>Login page</Label>
          <p>
            Image by{' '}
            <ExternalLink
              className="h-fit !text-base"
              href="https://www.freepik.com/free-vector/access-control-system-abstract-concept-vector-illustration-security-system-authorize-entry-login-credentials-electronic-access-password-passphrase-pin-verification-abstract-metaphor_24070702.htm#query=login&position=19&from_view=search&track=sph"
              text="vectorjuice"
            />{' '}
            on Freepik
          </p>
        </li>
        <li className="mt-8">
          <Label>Register page</Label>
          <p>
            Image by{' '}
            <ExternalLink
              className="h-fit !text-base"
              href="https://www.freepik.com/free-vector/online-school-platform-abstract-concept-vector-illustration-homeschooling-covid2019-qarantine-online-education-platform-digital-classes-virtual-courses-lms-school-abstract-metaphor_24070806.htm#query=signup&position=1&from_view=search&track=sph"
              text="vectorjuice"
            />{' '}
            on Freepik
          </p>
        </li>
        <li className="mt-8">
          <Label>Profile page</Label>
          <p>
            Image by{' '}
            <ExternalLink
              className="h-fit !text-base"
              href="https://www.freepik.com/free-vector/stay-home-abstract-concept-vector-illustration-forced-isolation-covid19-outbreak-prevention-measures-social-distance-governmental-support-self-protection-wear-mask-abstract-metaphor_24122238.htm#query=signup&position=0&from_view=search&track=sph"
              text="vectorjuice"
            />{' '}
            on Freepik
          </p>
        </li>
        <li className="mt-8">
          <Label>Font</Label>
          <p>
            <ExternalLink
              className="h-fit !text-base"
              href="https://fonts.google.com/specimen/Rubik"
              text="Rubik"
            />{' '}
            on Google Fonts
          </p>
        </li>
        <li className="mt-8">
          <Label>UI</Label>
          <p>
            <ExternalLink
              className="h-fit !text-base"
              href="https://ui.shadcn.com"
              text="shadcn/ui"
            />
          </p>
        </li>
        <li className="mt-8">
          <Label>Icons</Label>
          <p>
            <ExternalLink
              className="h-fit !text-base"
              href="https://www.radix-ui.com/icons"
              text="Radix-UI"
            />
          </p>
        </li>
      </ul>
    </div>
  );
}

import { Link } from 'react-router-dom'
import heroImg from '@/images/hero.png'
import reactLogo from '@icons/react.svg'
import viteLogo from '@icons/vite.svg'

export default function LandingPage() {
  return (
    <div className="landing-root">
      <section className="center-section">
        <div className="hero-container">
          <div className="hero-base">
            <img               src={heroImg}
              alt=""
              style={{ width: 170 }}
              
              className="hero-image"
            />
          </div>
          <div className="hero-framework">
            <img src={reactLogo} alt="React logo" style={{ width: 28 }}  />
          </div>
          <div className="hero-vite">
            <img src={viteLogo} alt="Vite logo" style={{ width: 26 }}  />
          </div>
        </div>

        <div className="hero-text">
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>

        <button type="button" className="counter-button">
          Count is 0
        </button>
      </section>

      <div className="ticks"></div>

      <section className="next-steps">
        <div className="step-card docs-card">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul className="social-links">
            <li>
              <Link href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" style={{ width: 18 }}  />
                Explore Vite
              </Link>
            </li>
            <li>
              <Link href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" style={{ width: 18 }}  />
                Learn more
              </Link>
            </li>
          </ul>
        </div>

        <div className="step-card social-card">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul className="social-links">
            <li>
              <Link href="https://github.com/vitejs/vite" target="_blank">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </Link>
            </li>
            <li>
              <Link href="https://chat.vite.dev/" target="_blank">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </Link>
            </li>
            <li>
              <Link href="https://x.com/vite_js" target="_blank">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </Link>
            </li>
            <li>
              <Link href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section className="spacer"></section>

      <style jsx>{`
        .landing-root {
          width: 1126px;
          max-width: 100%;
          margin: 0 auto;
          text-align: center;
          border-inline: 1px solid var(--border);
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font: 18px/145% system-ui, 'Segoe UI', Roboto, sans-serif;
          letter-spacing: 0.18px;
          color-scheme: light dark;
          color: var(--text);
          background: var(--bg);
        }

        .center-section {
          display: flex;
          flex-direction: column;
          gap: 25px;
          place-content: center;
          place-items: center;
          flex-grow: 1;
          padding: 32px 20px 24px;
        }

        .hero-container {
          position: relative;
          width: 170px;
        }

        .hero-base {
          position: relative;
          z-index: 0;
        }

        .hero-image {
          width: 170px;
          height: auto;
        }

        .hero-framework,
        .hero-vite {
          position: absolute;
        }

        .hero-framework {
          z-index: 1;
          top: 34px;
          left: 50%;
          transform: translateX(-50%) perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg) scale(1.4);
          height: 28px;
        }

        .hero-vite {
          z-index: 0;
          top: 107px;
          left: 50%;
          transform: translateX(-50%) perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg) scale(0.8);
          height: 26px;
          width: auto;
        }

        .hero-text h1 {
          font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
          font-weight: 500;
          font-size: 56px;
          letter-spacing: -1.68px;
          margin: 32px 0;
          color: var(--text-h);
        }

        .hero-text p {
          margin: 0;
        }

        .hero-text code {
          font-family: ui-monospace, Consolas, monospace;
          font-size: 15px;
          line-height: 135%;
          padding: 4px 8px;
          background: var(--code-bg);
          border-radius: 4px;
          color: var(--text-h);
        }

        .counter-button {
          font-family: ui-monospace, Consolas, monospace;
          font-size: 16px;
          padding: 5px 10px;
          border-radius: 5px;
          color: var(--accent);
          background: var(--accent-bg);
          border: 2px solid transparent;
          transition: border-color 0.3s;
          margin-bottom: 24px;
          cursor: pointer;
        }

        .counter-button:hover {
          border-color: var(--accent-border);
        }

        .counter-button:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        .ticks {
          position: relative;
          width: 100%;
        }

        .ticks::before,
        .ticks::after {
          content: '';
          position: absolute;
          top: -4.5px;
          border: 5px solid transparent;
        }

        .ticks::before {
          left: 0;
          border-left-color: var(--border);
        }

        .ticks::after {
          right: 0;
          border-right-color: var(--border);
        }

        .next-steps {
          display: flex;
          border-top: 1px solid var(--border);
          text-align: left;
        }

        .next-steps > .step-card {
          flex: 1 1 0;
          padding: 32px;
        }

        .docs-card {
          border-right: 1px solid var(--border);
        }

        .step-card h2 {
          font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
          font-weight: 500;
          font-size: 24px;
          line-height: 118%;
          letter-spacing: -0.24px;
          margin: 0 0 8px;
          color: var(--text-h);
        }

        .step-card p {
          margin: 0;
        }

        .step-card .icon {
          margin-bottom: 16px;
          width: 22px;
          height: 22px;
        }

        .social-links {
          list-style: none;
          padding: 0;
          display: flex;
          gap: 8px;
          margin: 32px 0 0;
        }

        .social-links a {
          color: var(--text-h);
          font-size: 16px;
          border-radius: 6px;
          background: var(--social-bg);
          display: flex;
          padding: 6px 12px;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: box-shadow 0.3s;
        }

        .social-links a:hover {
          box-shadow: var(--shadow);
        }

        .social-links .button-icon {
          height: 18px;
          width: 18px;
        }

        .logo {
          height: 18px;
        }

        .spacer {
          height: 88px;
          border-top: 1px solid var(--border);
        }

        @media (max-width: 1024px) {
          .landing-root {
            font-size: 16px;
          }

          .hero-text h1 {
            font-size: 36px;
            margin: 20px 0;
          }

          .center-section {
            padding: 32px 20px 24px;
            gap: 18px;
          }

          .next-steps {
            flex-direction: column;
            text-align: center;
          }

          .docs-card {
            border-right: none;
            border-bottom: 1px solid var(--border);
          }

          .next-steps > .step-card {
            padding: 24px 20px;
          }

          .social-links {
            margin-top: 20px;
            flex-wrap: wrap;
            justify-content: center;
          }

          .social-links li {
            flex: 1 1 calc(50% - 8px);
          }

          .social-links a {
            width: 100%;
            justify-content: center;
            box-sizing: border-box;
          }

          .spacer {
            height: 48px;
          }
        }

        @media (prefers-color-scheme: dark) {
          .landing-root {
            --text: #9ca3af;
            --text-h: #f3f4f6;
            --bg: #16171d;
            --border: #2e303a;
            --code-bg: #1f2028;
            --accent: #c084fc;
            --accent-bg: rgba(192, 132, 252, 0.15);
            --accent-border: rgba(192, 132, 252, 0.5);
            --social-bg: rgba(47, 48, 58, 0.5);
            --shadow: rgba(0, 0, 0, 0.4) 0 10px 15px -3px, rgba(0, 0, 0, 0.25) 0 4px 6px -2px;
          }

          .social-card .button-icon {
            filter: invert(1) brightness(2);
          }
        }
      `}</style>
    </div>
  )
}
import "../Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__addr">
        <h1 className="footer__logo">Fur Pals</h1>

        <h2>Contact</h2>

        <address>
          FUR PALS
          <a className="footer__btn" href="mailto:example@email.com">
            Email Us
          </a>
        </address>
      </div>

      <ul className="footer__nav">
        <li className="nav__item">
          <h2 className="nav__title">Home</h2>

          <ul className="nav__ul">
            <li>
              <a href="#">About</a>
            </li>

            <li>
              <a href="#">Products</a>
            </li>

            <li>
              <a href="#">Testimonials</a>
            </li>
          </ul>
        </li>

        <li className="nav__item nav__item--extra">
          <h2 className="nav__title">About Team</h2>

          <ul className="nav__ul nav__ul--extra">
            <li>
              <a href="#">About Design</a>
            </li>

            <li>
              <a href="#">Contact</a>
            </li>

            <li>
              <a href="#">Careers</a>
            </li>

            <li>
              <a href="#">Team</a>
            </li>

            <li>
              <a href="#">Pets</a>
            </li>

            <li>
              <a href="#">Press releases</a>
            </li>
          </ul>
        </li>

        <li className="nav__item">
          <h2 className="nav__title">Legal</h2>

          <ul className="nav__ul">
            <li>
              <a href="#">Privacy Policy</a>
            </li>

            <li>
              <a href="#">Terms of Use</a>
            </li>

            <li>
              <a href="#">Sitemap</a>
            </li>
          </ul>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;

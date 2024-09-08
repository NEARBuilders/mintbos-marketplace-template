const { page } = props;

page = page || "home";

const { Layout } = VM.require("${alias_DEVS}/widget/Layout") || {
  Layout: () => <>layout not found</>,
};

const { Router } = VM.require("${alias_DEVS}/widget/Router") || {
  Router: () => <>router not found</>,
};

const { href } = VM.require("${alias_DEVS}/widget/lib.url") || {
  href: () => "/",
};

const { getCartItemCount } = VM.require(
  "${config_account}/widget/SDK.cart"
) || {
  getCartItemCount: () => {},
};

const routerConfig = {
  param: "page",
  routes: {
    home: {
      path: "${config_account}/widget/page.home",
      init: {},
    },
    product: {
      path: "${config_account}/widget/page.product",
      init: {},
    },
    cart: {
      path: "${config_account}/widget/page.cart",
      init: {},
    },
    inspect: {
      path: "buildhub.near/widget/page.inspect",
      init: {
        widgetPath: props.widgetPath,
      },
    },
  },
};

const CSS = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: space-between;

  a {
    text-decoration: none;
  }

  .header {
    border: "solid";
    padding: 20px;

    display: flex;
    justify-content: space-between;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    width: 250px;
    padding: 20px;
    gap: 10px;
  }

  .button {
    width: 100%;
    padding: 5px;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    padding: 10px;

    img {
      height: 30px;
    }

    .content {
      display: flex;
      align-items: center;
    }

    .link-container {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-right: 20px;

      a {
        font-size: 24px;
        color: inherit;
        text-decoration: none;
        transition: all 300ms;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
`;

const NavLink = ({ to, children, passProps }) => (
  <Link
    to={href({
      widgetSrc: "${config_index}",
      params: {
        page: to,
        ...passProps,
      },
    })}
  >
    <button className="button">{children}</button>
  </Link>
);

const Header = () => (
  <div className="header">
    <h1>Black Dragon Marketplace</h1>
    <>
      <NavLink
        to="inspect"
        passProps={{
          widgetPath: routerConfig.routes[props.page].path ?? "${config_index}",
        }}
      >
        <i className="bi bi-code"></i>
        <span>View source</span>
      </NavLink>
    </>
  </div>
);

const Footer = () => (
  <div className="footer">
    <div className="content">
      <div className="link-container">
        <a
          href="https://twitter.com/nearbuilders"
          className="d-flex align-items-center"
          target="_blank"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M8 2.75H1L9.26086 13.7645L1.44995 22.7499H4.09998L10.4883 15.401L16 22.75H23L14.3917 11.2723L21.8001 2.75H19.1501L13.1643 9.63578L8 2.75ZM17 20.75L5 4.75H7L19 20.75H17Z"
              fill="#030F1C"
            />
          </svg>
        </a>
        <a href="https://nearbuilders.com/tg-builders" target="_blank">
          <i className="bi bi-telegram"></i>
        </a>
        <a
          href="https://github.com/NEARBuilders/blackdragon-marketplace-bos"
          target="_blank"
        >
          <i className="bi bi-github"></i>
        </a>
        <a href="https://${config_account}.social/" target="_blank">
          <i className="bi bi-code-slash"></i>
        </a>
      </div>
      <Link href="https://nearbuilders.org">
        <img
          src="https://ipfs.near.social/ipfs/bafkreiavh7rnvf4zzb5rjohul7xwrlgz4y6ysdtmdsvpjeqpjtmuvgal7a"
          alt="Near Builders"
        />
      </Link>
    </div>
  </div>
);

const CartCount = styled.span`
  background: #000;
  color: #fff;
  padding: ${numCartItems > 0 ? "8px 8px 8px 16px" : "8px 16px"};
  border-radius: 100%;
  font-size: 12px;
  margin-left: 5px;
  font-weight: bold;
  display: inline-block;
  text-align: center;
  line-height: 20px;
`;

const numCartItems = getCartItemCount();

const Sidebar = () => (
  <div className="sidebar">
    <NavLink to={"home"}>Home</NavLink>
    <NavLink to={"cart"}>
      Cart {numCartItems > 0 && <CartCount>{numCartItems}</CartCount>}
    </NavLink>
  </div>
);

const Content = () => (
  <Layout>
    <div style={{ minHeight: "80vh" }}>
      <Router config={routerConfig} page={page} {...props} />
    </div>
  </Layout>
);

return (
  <CSS>
    <Layout variant="sidebar" blocks={{ Sidebar, Header, Footer }}>
      <Content />
    </Layout>
  </CSS>
);

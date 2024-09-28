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
  "${config_account}/widget/lib.cart"
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
      path: "${alias_BUILD}/widget/page.inspect",
      init: {
        widgetPath: props.widgetPath,
      },
    },
  },
};

const CSS = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  a {
    text-decoration: none;
  }

  .header {
    border: "solid";
    padding: 20px 0px;

    display: flex;
    flex-direction: column;
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      .right-nav,
      .logo-area {
        display: flex;
        align-items: center;
        gap: 10px;
      }
    }
    .hero {
      display: flex;
      /* justify-content: center; */
      /* align-items: center; */
    }
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    justify-content: left;
    align-items: flex-start;
    width: 250px;
    padding: 20px;
    gap: 10px;
  }

  .button {
    background-color: #fff;
    color: #312f32;
    border: 1px solid #ed8a71;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
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

const CartCount = styled.span`
  background: #000;
  color: #fff;
  border-radius: 50%;
  font-size: 10px;
  font-weight: bold;
  display: inline-block;
  text-align: center;
  line-height: 20px;
  height: 18px;
  width: 18px;
  position: absolute;
  top: 1px;
  right: -2px;
  .numwrap {
    position: relative;
    top: -2px;
  }
`;

const numCartItems = getCartItemCount();

const NavItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* font-weight: 700; */
  i {
    margin-right: 5px;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  .cnt {
    position: relative;
    font-size: 30px;
  }
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: 1px solid #c3c3c3;
    color: #000000;
    outline: none;
    /* padding: 5px 20px; */
    padding: 0px 12px;
    border-radius: 5px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    :hover {
      background: #ecececda;
    }
  }
`;

const ProfileIcon = () => {
  const Wrapper = styled.svg`
    padding: 0.25rem;
    @media screen and (max-width: 768px) {
      display: none;
    }
  `;
  return (
    <Widget
      src={`${config_account}/widget/components.Profile`}
      props={{
        accountId: context.accountId,
      }}
    />
  );
};

const Header = () => (
  <div className="header">
    <div className="nav">
      <div className="logo-area">
        {/* <NavLink to={"home"}><img src="#" alt="bd-logo"/></NavLink> */}
        <NavItem>
          <NavLink to={"home"}>Home</NavLink>
        </NavItem>
      </div>
      <div className="right-nav">
        <NavItem>
          <NavLink
            to="inspect"
            passProps={{
              widgetPath:
                routerConfig.routes[props.page].path ?? "${config_index}",
            }}
          >
            <i className="bi bi-code"></i>
            <span>View source</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to={"cart"}>
            <div className="cnt">
              <i className="bi bi-cart"></i>{" "}
              {numCartItems > 0 && (
                <CartCount>
                  <div className="numwrap">{numCartItems}</div>
                </CartCount>
              )}
            </div>
          </NavLink>
        </NavItem>
        <NavItem>
          {context.accountId ? (
            <ProfileIcon />
          ) : (
            <div style={{ width: 100 }} class="login-container">
              <Wallet
                provides={({ signIn, signOut }) => {
                  return (
                    <button
                      onClick={signIn}
                      id="open-walletselector-button"
                      type="button"
                      class="login-button button"
                    >
                      Login
                    </button>
                  );
                }}
              />
            </div>
          )}
        </NavItem>
      </div>
    </div>
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
          href="https://github.com/NEARBuilders/mintbos-marketplace-template"
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

const Sidebar = () => (
  <div className="sidebar">
    <NavItem>
      <NavLink to={"home"}>Home</NavLink>
    </NavItem>
    <NavItem>
      <NavLink to={"cart"}>
        <div className="cnt">
          <i className="bi bi-cart"></i>{" "}
          {numCartItems > 0 && (
            <CartCount>
              <div className="numwrap">{numCartItems}</div>
            </CartCount>
          )}
        </div>
      </NavLink>
    </NavItem>
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
  <CSS className="container">
    <Layout variant="standard" blocks={{ Sidebar, Header, Footer }}>
      <Content />
    </Layout>
  </CSS>
);

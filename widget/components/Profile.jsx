const accountId = props.accountId;
const size = props.size ?? "md";
const showAccountId = props.showAccountId;
const Avatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  max-width: 40px;
  min-height: 40px;
  max-height: 40px;
  &.sm {
    min-width: 30px;
    max-width: 30px;
    min-height: 30px;
    max-height: 30px;
  }
  &.md {
    min-width: 40px;
    max-width: 40px;
    min-height: 40px;
    max-height: 40px;
  }
  pointer-events: none;
  flex-shrink: 0;
  border: 1px solid #eceef0;
  overflow: hidden;
  border-radius: 40px;
  transition: border-color 200ms;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    margin: 0 !important;
  }
`;

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  :hover {
    cursor: pointer;
  }
  .signout-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  .signout-button {
    background-color: #fff;
    color: #312f32;
    border: 1px solid #ed8a71;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  .tab,
  .ctab {
    text-decoration: none;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 0.2rem;
    border-radius: 0.25rem;
    padding: 8px 12px;
    font-weight: 500;
    font-size: 16px;
    line-height: 18px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
    cursor: pointer;
    color: #000;
    background-color: #fff;
    width: fit-content;

    svg {
      margin-right: 7px;
      min-width: 24px;
      path {
        stroke: #000;
      }
    }
    &:focus {
      color: #4f58a3;
      box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
      background-color: rgba(59, 130, 246, 0.15);
      outline: 2px solid transparent;
      outline-offset: 2px;
      svg {
        path {
          stroke: #4f58a3;
        }
      }
    }
    &:hover {
      color: #4f58a3;
      background-color: rgba(66, 153, 225, 0.15);
      svg {
        path {
          stroke: #c5d0ff;
        }
      }
    }
  }
  .ctab {
    background-color: var(--gray-100, #f3f4f8);
    color: var(--gray-800, #282a3a);
    width: 100%;
    font-size: 12px;
  }
  .dropdown-menu.show {
    margin: 10px !important;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 207px;
    width: fit-content;
    padding: 0.8rem;
  }
  .dropdown-menu[data-bs-popper] {
    left: unset;
    right: var(--bs-dropdown-spacer, 0);
    @media (max-width: 800px) {
      left: var(--bs-dropdown-spacer, 0);
      right: unset;
    }
  }
  .dropdown-toggle::after {
    display: none;
  }
`;
const profile = Social.get(`${accountId}/profile/**`, "final");
const profileUrl = `https://mintbos.vercel.app/bos.genadrop.near/widget/Mintbase.App.Index?page=human&tab=owned&accountId=${accountId}`;
return (
  <Root>
    <div
      rel="noopener noreferrer"
      className="dropdown-toggle"
      id="dropdownMenu2222"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <div className="d-flex gap-2 align-items-center">
        <Avatar className={size}>
          <Widget
            src="mob.near/widget/Image"
            props={{
              image: profile.image,
              alt: profile.name,
              fallbackUrl:
                "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
            }}
          />
        </Avatar>
        {showAccountId && (
          <div>
            {(accountId ?? "").substring(0, 20)}
            {(accountId ?? "").length > 20 ? "..." : ""}
          </div>
        )}
      </div>
    </div>
    <ul className="dropdown-menu" aria-labelledby="dropdownMenu2222">
      <li>
        <Link
          type="button"
          className={`dropdown-item tab`}
          to={profileUrl}
          target="_blank"
        >
          <i class="bi bi-box-arrow-up-right"></i>
          {accountId}
        </Link>
      </li>
        <div>
            <Wallet
              provides={({ signIn, signOut }) => {
                return (
                  <button
                    onClick={signOut}
                    id="open-walletselector-button"
                    type="button"
                    className="signout-button"
                  >
                    Sign Out
                  </button>
                );
              }}
            />
        </div>
    </ul>
  </Root>
);

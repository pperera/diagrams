import React, {
  useRef,
  useCallback,
  ReactNode,
  MouseEvent as ReactMouseEvent,
  useState,
  useEffect,
} from "react";
import { useAuth } from "../Auth";
import { closeMenu } from "./Dropdown";
import { MarkGithubIcon, PlusIcon } from "@primer/octicons-react";
import { navigateTo } from "src/Nav";
import type { newNotebookWithContent } from "src/firebase";
import { DEFAULT_EXAMPLE } from "src/example";

declare var newNotebookTemplates: { name: string; content: string }[];

export function CreateMenu(props: {
  newNotebook: typeof newNotebookWithContent;
}) {
  return (
    <>
      <details className="dropdown details-reset details-overlay d-inline-block mr-2">
        <summary aria-haspopup="true">
          <PlusIcon size={16} />
          <div className="dropdown-caret"></div>
        </summary>

        <ul className="dropdown-menu dropdown-menu-sw" style={{ width: 230 }}>
          <li className="dropdown-header">Create notebook</li>
          <li>
            <a
              className="dropdown-item"
              href={""}
              onClick={(e) => {
                props.newNotebook(DEFAULT_EXAMPLE, {
                  isPrivate: true,
                  publicRead: false,
                });
                closeMenu();
                e.preventDefault();
                return false;
              }}
            >
              <span>Private read & write</span>
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              href={""}
              onClick={(e) => {
                props.newNotebook(DEFAULT_EXAMPLE, {
                  isPrivate: true,
                  publicRead: true,
                });
                closeMenu();
                e.preventDefault();
                return false;
              }}
            >
              <span>Public read</span>
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              href={""}
              onClick={(e) => {
                props.newNotebook(DEFAULT_EXAMPLE, {
                  isPrivate: false,
                  publicRead: true,
                });
                closeMenu();
                e.preventDefault();
                return false;
              }}
            >
              <span>Public read & write</span>
            </a>
          </li>
          <li className="dropdown-divider" role="separator"></li>
          <li className="dropdown-header">From template</li>
          {newNotebookTemplates.map(($) => (
            <li key={$.name}>
              <a
                className="dropdown-item"
                href={""}
                onClick={(e) => {
                  props.newNotebook($.content, {
                    isPrivate: false,
                    publicRead: true,
                  });
                  closeMenu();
                  e.preventDefault();
                  return false;
                }}
              >
                <span>{$.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}

export function UserMenu() {
  const auth = useAuth();

  if (!auth.data) {
    return (
      <>
        <details className="dropdown details-reset details-overlay d-inline-block mr-2">
          <summary aria-haspopup="true">
            <span
              className="btn btn-invisible user-name"
              style={{ color: "#000" }}
            >
              <img
                className="avatar avatar-small"
                alt="Anonymous"
                src="https://user-images.githubusercontent.com/334891/29999089-2837c968-9009-11e7-92c1-6a7540a594d5.png"
                width="20"
                height="20"
                aria-label="Sign in"
              />
              <div className="dropdown-caret"></div>
            </span>
          </summary>

          <ul className="dropdown-menu dropdown-menu-sw">
            <li className="dropdown-header">Anonymous</li>
            <li>
              <a
                className="dropdown-item"
                href={document.location.toString()}
                onClick={() => {
                  auth
                    .signin()
                    .then(() => closeMenu())
                    .catch(() => closeMenu());
                }}
              >
                <MarkGithubIcon size={16} className="mr-2" />
                <span>Sign in</span>
              </a>
            </li>
          </ul>
        </details>
      </>
    );
  }

  return (
    <>
      <details className="dropdown details-reset details-overlay d-inline-block mr-2">
        <summary aria-haspopup="true">
          <span
            className="btn btn-invisible user-name"
            style={{ color: "#000" }}
          >
            <img
              className="avatar avatar-small"
              alt={auth.data.user.displayName!}
              src={`${auth.data.user.photoURL}&s=40`}
              width="20"
              height="20"
              aria-label={auth.data.user.displayName!}
            />
            <div className="dropdown-caret"></div>
          </span>
        </summary>

        <ul className="dropdown-menu dropdown-menu-sw">
          <li className="dropdown-header">{auth.data.user.displayName}</li>
          <li>
            <a
              className="dropdown-item"
              href={"#/list"}
              onClick={() => {
                navigateTo("/list");
              }}
            >
              <span>My notebooks</span>
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              href={document.location.toString()}
              onClick={() => {
                auth
                  .signout()
                  .then(() => closeMenu())
                  .catch(() => closeMenu());
              }}
            >
              <span>Sign out</span>
            </a>
          </li>
        </ul>
      </details>
    </>
  );
}

import React, {
  useRef,
  useCallback,
  ReactNode,
  MouseEvent as ReactMouseEvent,
  useState,
  useEffect,
} from "react";
import { CreateMenu, UserMenu } from "src/components/UserMenu";
import { useAuth } from "src/Auth";
import app from "firebase/app";
import { Link } from "react-router-dom";
import { navigateTo } from "src/Nav";
import { DEFAULT_EXAMPLE } from "src/example";
import {
  newNotebookWithContent,
  logEvent,
  NotebookOptions,
} from "src/firebase";
import { closeMenu } from "src/components/Dropdown";
import { Notebook } from "src/types";
import { SharingDetails } from "src/components/SharingDetails";

function ListNotebooks(props: { data: Record<string, Notebook> }) {
  return (
    <div className="Box">
      {Object.keys(props.data)
        .reverse()
        .map(($id) => (
          <div key={$id} className="Box-row d-flex flex-items-center">
            <div className="flex-auto">
              <strong className="mr-2">
                <Link to={`/notebook/${props.data[$id].meta.uid}/${$id}`}>
                  {props.data[$id].meta.title}
                </Link>
              </strong>
              <SharingDetails meta={props.data[$id].meta} />
              {/* <div className="text-small text-gray-light">Description</div> */}
            </div>
            <button
              type="button"
              className="btn btn-primary"
              name="button"
              onClick={() => {
                navigateTo(`/notebook/${props.data[$id].meta.uid}/${$id}`);
              }}
            >
              Open
            </button>
          </div>
        ))}
    </div>
  );
}

export function List() {
  const auth = useAuth();
  const [myNotebooks, setMyNotebooks] = useState<any>(null);
  const [creating, setCreating] = useState<boolean>(false);

  document.title = "My notebooks - Sequence diagrams";

  useEffect(() => {
    if (auth.uid) {
      app
        .database()
        .ref("users/" + auth.uid + "/notebooks")
        .once("value", (snap) => {
          setMyNotebooks(snap.toJSON());
        });
    }
  }, [auth.uid]);

  if (!auth.uid) {
    return (
      <div className="p-11">
        Please sign in to see this page. <UserMenu />
      </div>
    );
  }

  async function newNotebook(content: string, options: NotebookOptions) {
    setCreating(true);

    if (!auth.uid) {
      await auth.signin();
    }

    closeMenu();
    const ret = await newNotebookWithContent(content, options);
    const { ref, succeed, owner } = ret;

    setCreating(false);

    if (succeed) {
      logEvent("new_notebook_list");
      navigateTo(`/notebook/${owner}/${ref.key}`);
    }

    return ret;
  }

  return (
    <div className="content p-responsive" style={{ left: 0 }}>
      <div className="top-bar content-bar d-flex flex-justify-between">
        <div className="p-2 d-flex">
          <span className="flex-self-center">My notebooks</span>
        </div>

        <div className="p-2 d-flex" style={{ alignItems: "center" }}>
          <CreateMenu newNotebook={newNotebook} />
          <UserMenu />
        </div>
      </div>
      <div className="scroll p-4">
        <div className="Subhead pt-4">
          <div className="Subhead-heading">My notebooks</div>
          <div className="Subhead-actions">
            <button
              disabled={!!creating}
              className="btn btn-sm btn-primary"
              role="button"
              onClick={() =>
                newNotebook(DEFAULT_EXAMPLE, {
                  isPrivate: true,
                  publicRead: false,
                })
              }
            >
              New private notebook
              {creating && <span className="AnimatedEllipsis"></span>}
            </button>
            <button
              disabled={!!creating}
              className="btn btn-sm btn-primary"
              role="button"
              onClick={() =>
                newNotebook(DEFAULT_EXAMPLE, {
                  isPrivate: false,
                  publicRead: true,
                })
              }
            >
              New public notebook
              {creating && <span className="AnimatedEllipsis"></span>}
            </button>
          </div>
          <div className="Subhead-description">
            Here are the notebooks of your own.
          </div>
        </div>
        {myNotebooks ? (
          <ListNotebooks data={myNotebooks} />
        ) : (
          <span className="m-1">
            <span>Loading</span>
            <span className="AnimatedEllipsis"></span>
          </span>
        )}
        {/* <div className="Subhead pt-4">
          <div className="Subhead-heading">Shared with me</div>
        </div> */}
      </div>
    </div>
  );
}

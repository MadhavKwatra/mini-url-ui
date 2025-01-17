import CopyToClipboard from "react-copy-to-clipboard";

const CopyToClipboardComponent = (props) => {
  // eslint-disable-next-line no-undef
  const { text, onCopy } = props;
  return (
    <CopyToClipboard text={text} onCopy={onCopy}>
      <button className="copy-button" aria-label="Copy to clipboard">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
    </CopyToClipboard>
  );
};

export default CopyToClipboardComponent;

export default function CustomTitle(props) {
  const { title, onClose } = props;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <h4 style={{ flex: 1, margin: 0, fontWeight: 500 }}>{title}</h4>
      <div onClick={onClose}>
        <i className="fa fa-close"></i>
      </div>
    </div>
  );
}

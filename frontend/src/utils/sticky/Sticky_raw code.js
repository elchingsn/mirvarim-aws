const WrapComponent = ({ stickyRef }) => (
  
      <div ref={stickyRef}>
      </div>

);

const Navbar = ({ sticky }) => (
  <nav className={sticky ? "navbar navbar-sticky" : "navbar"}>
  </nav>
);


function App() {
  React.useEffect(() => {
    return () => {
      window.removeEventListener("scroll", () => handleScroll);
    };
  }, []);

  const [isSticky, setSticky] = React.useState(false);

  const stickyRef = React.useRef(null);
  const handleScroll = () => {
    window.pageYOffset > stickyRef.current.getBoundingClientRect().bottom
      ? setSticky(true)
      : setSticky(false);
  };

  const debounce = (func, wait = 2, immediate = true) => {
    let timeOut;
    return () => {
      let context = this, args = arguments;
      const later = () => {
        timeOut = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeOut;
      clearTimeout(timeOut);
      timeOut = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  window.addEventListener("scroll", debounce(handleScroll));

  return (
    <React.Fragment>
      <Navbar sticky={isSticky} />
      <WrapComponent stickyRef={stickyRef} /> 
    </React.Fragment>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

import React, { useState, useRef, useEffect } from 'react'
import withStyles from "@material-ui/core/styles/withStyles";


const Accordion = ({classes, title, children}) => {
  const [active, setActive] = useState(true)
  const contentRef = useRef(null)

  useEffect(() => {
    contentRef.current.style.maxHeight = active ? `${contentRef.current.scrollHeight}px` : '0px'
  }, [contentRef, active])

  const toogleActive = () => {
    setActive(!active)
  }

  const titleStyle = {
    fontWeight: 600,
    fontSize: '14px',
  }

  return (
    <div className={classes.section}>
      <button className={classes.title} onClick={toogleActive}>
        {title}
        <span className={active ? classes.rotate: classes.icon}>
          &gt;
        </span>
      </button>

      <div
        ref={contentRef}
        className={classes.content}
      >
        {children}
      </div>
    </div>
  )
}

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth:"700px",
    marginLeft:"auto",
    marginRight:"auto",
    alignItems:"center"
  },
  section: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: "10px"
  },
  title: {
    backgroundColor: "white",
    fontSize: "16px",
    padding: "0px",
    color: "#002984",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    border: "none",
    outline: "none",
    transition: "backgroundColor 0.6s ease"
  },
  icon: {
    marginLeft: "auto",
    marginRight: "15px",
    transition: "transform 0.6s ease"
  },  
  rotate: {
    marginLeft: "auto",
    marginRight: "15px",
    transition: "transform 0.6s ease",
    transform: "rotate(90deg)"
  },
  content: {
    backgroundColor: "white",
    overflow: "hidden",
    transition: "maxHeight 0.6s ease"
  }
});


export default withStyles(styles)(Accordion)
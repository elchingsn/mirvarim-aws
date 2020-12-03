import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";

import styles from "assets/jss/profilePageStyle.js";
const useStyles = makeStyles(styles);


const Privacy = ({ match }) => {
  const classes = useStyles();
  const id = match.params.id;

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);


  return (
          <div className={classes.container}>
            <h3> Privacy Policy </h3>
            <Divider/>
            <br/>
            <p>This privacy policy (this “Policy”) explains how personal information is collected, used, and disclosed by 
              Mirvarim, LLC. with its registered office in the State of and all its designated agents, employees and 
              subsidiaries (Mirvarim or “we”). This Policy applies to consumer users (individually referred to as “you”) 
              of Mirvarim’s websites, applications, and other online services (collectively, our “Sites”).
            </p>
            <h4> Part I - Information Collection</h4>
            <p>
              We collect information about you in various ways when you use our Sites. We use this information to, among 
              other things, provide the functionality and improve the quality of our Sites and personalize your experience.
              For example, we may collect your name, email address, phone number (including your mobile 
              phone number), survey responses, current and prior appointments details, favorite SMBs, special SMB requests, 
              notify of your appointments through our Sites, names and email addresses of recipients of Mirvarim Gift Cards 
              (as this term is defined in the Mirvarim Terms of Use), and other information you provide on our Sites. 
              We may also obtain information from other sources, such as third-party websites, applications, and services 
              (each, a “Third-Party Platform”), through which you connect with our Sites and combine that with information
              we collect on our Sites.
            </p>
            <p>
              When you visit our Sites, some information is automatically collected. For example, when you visit our Sites, 
              we may automatically collect your location, computer operating system, Internet Protocol (IP) address, access 
              times, browser type and language, and the website you visited before our Sites.
            </p>
            <h4> Part II - Use of Collected Information</h4>
            <p>
            We use personal information collected through our Sites for the purposes described in this Policy or disclosed to 
            you on our Sites or otherwise in connection with our services. We use your information to operate and improve our
            Sites, products, and services, such as:
            </p>
            <ol>
              <li>
                Make and change your appointments made through our Sites;
              </li>
              <li>
                Understand you and your preferences to enhance, personalize, and customize your experience and enjoyment
                 using our Sites, products, and services, such as understanding your appointment history to make
                  recommendations about other SMBs you may like;
              </li>
              <li>
               Respond to your comments and questions and provide customer service;
              </li>
              <li>
               Protect, investigate, and deter against fraudulent, unauthorized, or illegal activity.
              </li>
            </ol>
            <h4> Part III - Information Sharing</h4>
            <p>
              When you make an appointment through our Sites, your information is provided to us and to the SMB 
              with whom you choose to make the appointment. In order to facilitate your appointment, your information 
              is provided to that SMB, just as it would if you made an appointment by calling the SMB, emailing the SMB, 
              or using the SMB’s website. If you provide a mobile phone number, SMBs may send you text messages regarding 
              your reservation. 
            </p>   
            <p>
              We do not share your personal information with third parties other than as described above.
            </p>         
            <h4> Part IV - Security of Your Personal Information</h4>
            <p>
              Mirvarim takes reasonable steps to help protect your personal information in an effort to prevent loss, misuse, 
              unauthorized access, disclosure, alteration, and destruction. 
            </p>   
            <p>
              All passwords are encrypted and we do not have direct access to them. Our contracts with third parties that receive
              information about you are required to keep it secure and confidential.   
            </p> 
          </div>
  );
};
export default Privacy;

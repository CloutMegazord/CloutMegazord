import React from 'react';
import MuiTypography from "@material-ui/core/Typography";

export default function TermsContent(props) {
    return (<div style={{padding:'3vh 3vw'}}>

        <MuiTypography variant='h5' id="alert-dialog-title">{"Terms and Conditions for CloutMegazord service"}</MuiTypography>
        <MuiTypography paragraph={true}>
            Important: Please carefully read and understand these terms and conditions (“terms”).
        </MuiTypography>
        <MuiTypography paragraph={true}>
            By accessing or using websites and other digital properties on which these terms are posted or referenced (together, “online services”), you are agreed to the Terms and Conditions of the service.

<br/>Owners of domains:<br/>
"cloutmegazord.com"
"cloutmegazord.firebaseapp.com"
"cloutmegazord.web.app"
"www.cloutmegazord.com"
"signing-cloutmegazord.web.app"
"signing-cloutmegazord.firebaseapp.com"<br/>
or / and Users of Firebase projects:
"signing-cloutmegazord"
"CloutMegazord"
with <a href="https://firebase.google.com/docs/projects/iam/roles-basic" target="_blank">access roles</a>: "Owner" or "Editor" or "Viewer"

or/and GitHub Users who has/had access to the repositories:<br/>
<a href="https://github.com/CloutMegazord/signing-cloutmegazord" target="_blank">https://github.com/CloutMegazord/signing-cloutmegazord</a><br/>
<a href="https://github.com/CloutMegazord/CloutMegazord" target="_blank">https://github.com/CloutMegazord/CloutMegazord</a>
<br/>
with Role: "Admin" or "Write"
<br/>
(together, “CloutMegazord”)
                    </MuiTypography>
                    <MuiTypography  paragraph={true}>
                    CloutMegazord provides the online services “AS-IS” and without any warranties.
The online services may include inaccuracies or errors. CloutMegazord provides the online services “as is” and without warranties of any kind either expressed or implied. CloutMegazord disclaims all warranties of merchantability and fitness or a particular purpose. CloutMegazord does not warrant or make any representation that the online services will be accurate, reliable, uninterrupted or error-free, that defects will be corrected, or that the online services are free of viruses or other harmful components. You assume total responsibility related to your use of the online services. Your sole remedy against CloutMegazord and all other Members of the CloutMegazord System for dissatisfaction with the online services is to stop using them. This limitation of relief is a part of the bargain between the parties.
</MuiTypography>
<MuiTypography  paragraph={true}>
Third party services.
The online services may link to or allow you to use third-party websites, downloadable materials, content, social networks, or other digital services (together, “third party services”). These third parties may have their separate terms and conditions or privacy policies that you should review and understand before using them. CloutMegazord does not endorse and is not associated with any of these third party services. Neither CloutMegazord nor any other Members of the CloutMegazord System have any responsibility arising from or related to these third party services.
                </MuiTypography>
                <MuiTypography  paragraph={true}>
                CloutMegazord are not responsible for any transactions signed by any private keys, including private keys that interacted in any way with online services. CloutMegazord is not responsible for the consequences of unauthorized access, including those that led to any damage, including material or moral or reputational, to any private keys, including private keys that interacted with online services, this is also true in the case if causal unauthorized access became negligence or low qualification of the CloutMegazord.
                </MuiTypography>

                <MuiTypography  paragraph={true}>
                CloutMegazord is not responsible for the consequences of unauthorized access to BitClout accounts or private keys, including those that led to any damage, including material or moral or reputational, to any private keys, that interacted with online services, this is also true in the case if causal unauthorized access became negligence or low qualification of the CloutMegazord.
                </MuiTypography>
                <MuiTypography  paragraph={true}>
                You are responsible for your devices and accounts. The approaches used in CloutMegazord are risky from the point of view of the security of managing private keys and are not - secure, recommended, tested. You use them at your own risk and are fully responsible for related problems. "Never risk more than you can lose."
                </MuiTypography>
    </div>)
}
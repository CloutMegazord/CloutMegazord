import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Icon from "@material-ui/core/Icon";
import { bugs, website, server } from "variables/general.js";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

function makeid(length) {
  var result           = [];
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() *
charactersLength)));
 }
 return result.join('');
}


class TasksProvider{
  constructor(api, user) {
    this.api = api;
    this.user = user
  }

  getTasks() {
    var tasks = [
      {
        id: makeid(10),
        creator: {
          avatar: 'data:image/jpeg;base64,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',
          pub_key: makeid(10),
          status: 'confirmed',
          name: 'bitclouthunt',
          link: 'https://bitclout.com/u/bitclouthunt'
        },
        type: 'buy',//'sell', 'Update profile'
        date: Date.now()
      },
      {
        id: makeid(10),
        creator: {
          avatar: 'data:image/jpeg;base64,/9j/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDIBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/AABEIAGQAZAMBIgACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AOeooor9NO0KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoorqPBXhKTxNqG+YMmnQEec443n+4vv6+g+orKtWhRpupN2SBtJXZy/YHsenvRXul3D4d8VW174bgeIS2QAXy1A8k9inqAeD+VeLappl1o+pTWF4myaI4OOjDsw9jXLgsfHEtxceWS6Pt0ZMZ8xUooorvKCiiigAooooAKKKKACiiremabdavqMNjZR755TgegHcn0ApSkopyk9EBc8N+HrrxJqyWdvlIx8002MiNPX6+gr0Hxd4htfCOkR+HNCxHc7MM6nJhU9yf77f8A1/StIwp4K0OLR9Dtje6zcjICrks3Qyv6KO2fp61l6d4CstOWTWfF99HNIT5kiu+I9x5+Y9WPt0+tfN1cXTxFRVa3wL4Y9ZPvbt/Xcxck3d7Hmel6nc6RqUN/ZS7Z4WyOchh3B9Qa9V1iwsviN4Xi1PTgqajApCqTyG6tEx/UH6Huaetx4I8a7tNSNIJ0O2BhGIXPuh7j2P5ViwaRrfw51Y38Kvf6O/y3BiXkJ6svYj1HHbjNaV66rzUop060dk+q7fMbd32Z5y6PHI0cisjoSrKwwQR1BptenePvDUGqWK+KNF2yq8YecR8iRMcSD3Hf2+leY17GExUcTT546PquzNIy5lcKKKK6RhRRRQAUUUUAPhhluJ44II2klkYKiKMliegFe6eC/CcXhjTS821tQmUGeTso/uA+g/U/hXm/w41DS9O8SNJqTJGzxbIJpPuo2eee2Rxn/Gu38d6J4j1m33aVfLLYlQWs4/kZ/fdnDj24/Gvns2qzq1lhXLki92+plUd3yjfEPxE0rR5JotKjjvb5uHkX/Vgj+8w+9j0H5ivK9X1zUtduvtGo3LSsPup0RP8AdXoP51Tnt5rSdre4heGZOGjkUqw/A1HXp4PL6GGV4K77vcuMFHYOhBHBHIrufDXxKv8AS9ltqoe+tBwHJ/eoPqfvD68+9cNRW+Iw1LER5KquhuKe59EaBc6Ne2Uk+jSRtbyNueNOAjHrlf4Se479a8r8f+EDoN99vso/+JdcN90D/Uuf4foe35elYXhyHXZNTWTQEuPtK8F4uFA9GJ+XHsa9scO/hSZfFX2NQYiLgxE7MY9+/wBO/SvnZxllmJUoT5lLddf67Mx+CR8+UUfTOO2aK+pNwooooAKKKKACtzQfF2seHmC2lxvt88203zRn6d1/CsOioqUoVY8s1dA0nuet2/ifwp42gS01q2S1u+imU4wf9iQdPocfjWFr/wAL7+y3T6PJ9ut+vlNgSge3Zv0NcD1rotA8a6z4fKxwz+faj/l3nJZQP9k9V/Dj2rzHga2GfNg5afyvb5dv61I5WvhKWm+GtZ1a6a3tNPmLo22QyKUVD/tE9Pp1rvtP+HGkaNbfbvEuoRuq8mPf5cQ9ierfp9Kqal8WrmW2Cabpy28xHzSTPvC/QDGfx/KuC1HU77Vrk3GoXUtxL2Ltwv0HQfhRyY/E6Tfs4+Wr+/oHvS8j0bU/iZp+m2/2Hw1YRlE4WV02Rj3Cjk/jivPdV1vUtbn87UbyScg5VScKv0UcCqFFdeGwNDD6wWvd6sailsFFFFdZQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//Z',
          pub_key: makeid(10),
          status: 'confirmed',
          name: 'bitclouthunt',
          link: 'https://bitclout.com/u/bitclouthunt'
        },
        type: 'sell',//'sell', 'Update profile'
        date: Date.now()
      }
    ];
    return tasks
  }
}

const useStyles = makeStyles(styles);

export default function TableList() {
  const classes = useStyles();
  const megazord_account = {
    name: 'BitCloutTechFound'
  }
  const user = {pub_key: makeid(10)}
  const taskProvider = new TasksProvider({}, {pub_key: makeid(10)});
  const [_tasks, setTasks] = React.useState(taskProvider.getTasks());

  // setTimeout(() => {
  //   setTasks(arr => taskProvider.getTasks(), 1000)
  // })

  return (
    <GridContainer>
      {/* <GridItem xs={12} sm={12} md={6}>
        <Tasks
          checkedIndexes={[0, 3]}
          tasksIndexes={[0, 1, 2, 3]}
          tasks={tasks}
        />
      </GridItem> */}
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>{megazord_account.name}</h4>
            <p className={classes.cardCategoryWhite}>
              Here is a subtitle for this table
            </p>
          </CardHeader>
          <CardBody>
            <Tasks
              tableHeaderColor="primary"
              tableHead={["Task type", "Created by", "Date", "Additional", "Power"]}
              user={user}
              tasks={_tasks}
            />
            {/* <Table
              tableHeaderColor="primary"
              tableHead={["Type", "Creator", "Date", "Info", "Run"]}
              tableData={[[1,2,3,4,5]]}
            /> */}
          </CardBody>
        </Card>
      </GridItem>
      {/* <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>
              Table on Plain Background
            </h4>
            <p className={classes.cardCategoryWhite}>
              Here is a subtitle for this table
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["ID", "Name", "Country", "City", "Salary"]}
              tableData={[
                ["1", "Dakota Rice", "$36,738", "Niger", "Oud-Turnhout"],
                ["2", "Minerva Hooper", "$23,789", "Curaçao", "Sinaai-Waas"],
                ["3", "Sage Rodriguez", "$56,142", "Netherlands", "Baileux"],
                [
                  "4",
                  "Philip Chaney",
                  "$38,735",
                  "Korea, South",
                  "Overland Park"
                ],
                [
                  "5",
                  "Doris Greene",
                  "$63,542",
                  "Malawi",
                  "Feldkirchen in Kärnten"
                ],
                ["6", "Mason Porter", "$78,615", "Chile", "Gloucester"]
              ]}
            />
          </CardBody>
        </Card>
      </GridItem> */}
    </GridContainer>
  );
}

import { List, Tag } from 'antd';
import { Component, Fragment } from 'react';
import { Event } from 'services/event';
import listStyles from './ScheduleList.module.scss';
import moment from 'moment';

enum EventTypeColor {
  deadline = 'red',
  test = '#63ab91',
  jstask = 'green',
  htmltask = 'green',
  course = 'green',
  htmlcssacademy = 'green',
  externaltask = 'green',
  codewars = 'green',
  codejam = 'green',
  newtask = 'green',
  lecture = 'blue',
  lecture_online = 'blue',
  lecture_offline = 'blue',
  lecture_mixed = 'blue',
  lecture_self_study = 'blue',
  info = '#ff7b00',
  warmup = '#63ab91',
  meetup = '#bde04a',
  workshop = '#bde04a',
  interview = '#63ab91',
}

const EventTypeToName: Record<string, string> = {
  lecture_online: 'online lecture',
  lecture_offline: 'offline lecture',
  lecture_mixed: 'mixed lecture',
  lecture_self_study: 'self study',
  warmup: 'warm-up',
  jstask: 'js task',
  kotlintask: 'kotlin task',
  objctask: 'objc task',
  htmltask: 'html task',
  codejam: 'code jam',
  externaltask: 'external task',
  htmlcssacademy: 'html/css academy',
  codewars: 'codewars',
  'codewars:stage1': 'codewars',
  'codewars:stage2': 'codewars',
};

interface IScheduleList {
  classes?: Array<String>;
  eventsData: Array<Event>;
}

class ScheduleList extends Component<IScheduleList> {
  renderListItem(deadLineTime, startTime) {
    if (deadLineTime) {
      return <div>Deadline : {moment(deadLineTime, 'YYYY-MM-DD HH:mm').format('DD.MM.YYYY HH:mm')} </div>;
    }
    return <div>Start : {moment(startTime, 'YYYY-MM-DD HH:mm').format('DD.MM.YYYY HH:mm')}</div>;
  }
  render() {
    const { eventsData } = this.props;
    return (
      <section className={[listStyles.ScheduleList, this.props.classes].filter(Boolean).join(' ')}>
        <List>
          {eventsData.map((event) => (
            <List.Item>
              <List.Item.Meta
                description={
                  <Fragment>
                    <div className={[listStyles.one_list_item, this.props.classes].filter(Boolean).join(' ')}>
                      <h3>{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</h3>
                      <div>
                        <Tag color={EventTypeColor[event.type]}>{EventTypeToName[event.type] || event.type}</Tag>
                      </div>
                      {this.renderListItem(event.deadLine, event.dateTime)}
                    </div>
                  </Fragment>
                }
              />
            </List.Item>
          ))}
        </List>
      </section>
    );
  }
}

export { ScheduleList };

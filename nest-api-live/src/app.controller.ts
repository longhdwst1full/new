import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Response } from 'express';
import { AppService } from './app.service';


AWS.config.update({
    "accessKeyId": process.env.AWS_ACCESS_KEY_ID,
    "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }



    @Post("/auth")
    async chatAuthHandler(@Body() body: any, @Res() res: Response) {

        console.info('chatAuthHandler received:', body);

        const { arn, roomIdentifier, userId } = body;
        const roomId = arn || roomIdentifier;
        const additionalAttributes = body.attributes || {};
        const capabilities = body.capabilities || []; // The permission to view messages is implicit
        const durationInMinutes = body.durationInMinutes || 55; // default the expiration to 55 mintues

        if (!roomId || !userId) {
            return res.json({ error: 'Missing parameters: `arn or roomIdentifier`, `userId`' });
        }
        const params = {
            roomIdentifier: `${roomId}`,
            userId: `${userId}`,
            attributes: { ...additionalAttributes },
            capabilities: capabilities,
            sessionDurationInMinutes: durationInMinutes,
        };

        try {

            const IVSChat = new AWS.Ivschat();
            const data = await IVSChat.createChatToken(params).promise();
            console.info("Got data:", data);
            res.json(data);
        } catch (err) {
            console.error('ERROR: chatAuthHandler > IVSChat.createChatToken:', err);
            res.json(err.stack)
        }
    }
    //chat events
    @Post("/chat-event")
    async chatEventHandler(@Body() body: any, @Res() res: Response) {
        // Parse the incoming request body

        const { arn, eventAttributes, eventName } = body;

        // Construct parameters.
        // Documentation is available at https://docs.aws.amazon.com/ivs/latest/ChatAPIReference/Welcome.html
        const params = {
            "roomIdentifier": `${arn}`,
            "eventName": eventName,
            "attributes": { ...eventAttributes }
        };
        const IVSChat = new AWS.Ivschat();

        try {
            await IVSChat.sendEvent(params).promise();
            console.info("chatEventHandler > IVSChat.sendEvent > Success");
            res.json({
                arn: `${arn}`,
                status: "success"
            });
        } catch (err) {
            console.error('ERROR: chatEventHandler > IVSChat.sendEvent:', err);
            res.json(err.stack);
        }


        return res.json(params);
    }

    @Post("/getList-room")
    async getroomlist(@Body() body: any, @Res() res: Response) {
        const ivschat = new AWS.Ivschat();

        const data333 = await ivschat.listRooms().promise();
        console.log('Chat rooms:', data333.rooms);
        return res.json(data333);


    }
    @Post("/create-room")
    async createRoom(@Body() body: any, @Res() res: Response) {
        const ivschat = new AWS.Ivschat();
        const params = {
            name: 'myChatRoom', // Tên của phòng chat
        };
        const data1 = await ivschat.createRoom(params).promise();

        ivschat.createRoom(body, (error, data) => {
            if (error) {
                console.log(error);
                res.status(500).send(error.code);
            } else if (data) {


                res.json({ data, data1 });
            }
        });

        return res.json(data1);
    }

    @Post("/get-room")
    async getRoom(@Res() res: Response) {
        const ivschat = new AWS.Ivschat();

        const params = {
            "identifier": "string"
        }
        ivschat.getRoom((error, data) => {
            if (error) {
                console.log(error);
                res.status(500).send(error.code);
            } else if (data) {


                res.json(data);
            }
        });
    }
}

import { EmailService } from '@app/email';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateFoodDto } from './dto/foods.dto';
import { Request, Response } from 'express';

@Injectable()
export class FoodsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly email: EmailService,
  ) {}

  // create foods
  async createFood(createFoodDto: CreateFoodDto, req: any, res: Response) {
    const { name, description, price, category, estimatedPrice, images } = createFoodDto;
    const restourantId = req.restaurant.id;

    // check restaurant exists
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restourantId },
    });
    if (!restaurant) {
      return { success: false, message: "Restaurant not found" };
    }

    // check food exists
    const food = await this.prisma.food.findUnique({
      where: { name },
    });
    if (food) {
      return { success: false, message: "Food already exists" };
    }

    // create food
    try {
      await this.prisma.food.create({
        data: {
          name,
          description,
          price,
          category,
          estimatedPrice,
          images,
          restaurant: {
            connect: {
              id: restourantId,
            },
          },
        },
      });

      return {success: true, message:"Food created successfully"}
    } catch (error) {
      return {success: false, message:(error as Error).message}
    }

  }

  // get all for restourant foods
  async getRestourantAllFoods(req: any) {
    const restourantId = req.restaurant.id;
    try {
      const foods = await this.prisma.food.findMany({
        where: {
          restaurant: {
            id: restourantId,
          },
        },
        include: {
          restaurant: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return { success: true, data: foods  };
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  }

  // delete food by id restourant
  async deleteFoodById(req: any, id: string) {
    try {
      const checkFood = await this.prisma.food.findUnique({
        where: {
          id,
          restaurant: {
            id: req.restaurant.id,
          },
        },
      })

      if(!checkFood) {
        throw new Error("Food not found")
      }
      await this.prisma.food.delete({
        where: {
          id,
          restaurant: {
            id: req.restaurant.id,
          },
        },
      });
      return { success: true, message:"Food deleted successfully"  };
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  } 
}

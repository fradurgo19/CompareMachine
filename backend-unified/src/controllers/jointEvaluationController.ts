import { Request, Response } from 'express';
import { prisma } from '../index';
import { jointEvaluationSchema, jointEvaluationQuerySchema } from '../validators/jointEvaluation';
import { calculateJointEvaluation } from '../utils/jointCalculations';
import { ApiResponse } from '../types';

export const getJointEvaluations = async (req: Request, res: Response) => {
  try {
    const query = jointEvaluationQuerySchema.parse(req.query);
    const { page, limit, model, series, ott, sortBy, sortOrder } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (model) {
      where.model = { contains: model, mode: 'insensitive' };
    }

    if (series) {
      where.series = { contains: series, mode: 'insensitive' };
    }

    if (ott) {
      where.ott = { contains: ott, mode: 'insensitive' };
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy) {
      orderBy = { [sortBy]: sortOrder };
    }

    const [evaluations, total] = await Promise.all([
      prisma.jointEvaluation.findMany({
        where,
        orderBy,
        skip,
        take: limit
      }),
      prisma.jointEvaluation.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    const response: ApiResponse<typeof evaluations> = {
      success: true,
      data: evaluations,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting joint evaluations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch joint evaluations'
    });
  }
};

export const getJointEvaluationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const evaluation = await prisma.jointEvaluation.findUnique({
      where: { id }
    });

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Joint evaluation not found'
      });
    }

    const response: ApiResponse<typeof evaluation> = {
      success: true,
      data: evaluation
    };

    return res.json(response);
  } catch (error) {
    console.error('Error getting joint evaluation by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch joint evaluation'
    });
  }
};

export const createJointEvaluation = async (req: Request, res: Response) => {
  try {
    const data = jointEvaluationSchema.parse(req.body);
    const userId = (req as any).user.id;

    // Calculate joint evaluation results
    const calculations = calculateJointEvaluation(
      data.standardDiameter,
      data.structureHousingDiameter,
      data.bushingDiameter,
      data.pinDiameter
    );

    const evaluation = await prisma.jointEvaluation.create({
      data: {
        ...data,
        ...calculations,
        userId,
        photos: [] // TODO: Handle file uploads
      }
    });

    const response: ApiResponse<typeof evaluation> = {
      success: true,
      data: evaluation,
      message: 'Joint evaluation created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating joint evaluation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create joint evaluation'
    });
  }
};

export const updateJointEvaluation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = jointEvaluationSchema.parse(req.body);
    const userId = (req as any).user.id;

    // Check if evaluation exists and belongs to user
    const existingEvaluation = await prisma.jointEvaluation.findFirst({
      where: { id, userId }
    });

    if (!existingEvaluation) {
      return res.status(404).json({
        success: false,
        message: 'Joint evaluation not found or access denied'
      });
    }

    // Recalculate results
    const calculations = calculateJointEvaluation(
      data.standardDiameter,
      data.structureHousingDiameter,
      data.bushingDiameter,
      data.pinDiameter
    );

    const evaluation = await prisma.jointEvaluation.update({
      where: { id },
      data: {
        ...data,
        ...calculations
      }
    });

    const response: ApiResponse<typeof evaluation> = {
      success: true,
      data: evaluation,
      message: 'Joint evaluation updated successfully'
    };

    return res.json(response);
  } catch (error) {
    console.error('Error updating joint evaluation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update joint evaluation'
    });
  }
};

export const deleteJointEvaluation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // Check if evaluation exists and belongs to user
    const existingEvaluation = await prisma.jointEvaluation.findFirst({
      where: { id, userId }
    });

    if (!existingEvaluation) {
      return res.status(404).json({
        success: false,
        message: 'Joint evaluation not found or access denied'
      });
    }

    await prisma.jointEvaluation.delete({
      where: { id }
    });

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Joint evaluation deleted successfully'
    };

    return res.json(response);
  } catch (error) {
    console.error('Error deleting joint evaluation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete joint evaluation'
    });
  }
};

export const calculateJointEvaluationResults = async (req: Request, res: Response) => {
  try {
    const { standardDiameter, structureHousingDiameter, bushingDiameter, pinDiameter } = req.body;

    if (!standardDiameter || !structureHousingDiameter || !bushingDiameter || !pinDiameter) {
      return res.status(400).json({
        success: false,
        message: 'All diameter values are required'
      });
    }

    const calculations = calculateJointEvaluation(
      standardDiameter,
      structureHousingDiameter,
      bushingDiameter,
      pinDiameter
    );

    const response: ApiResponse<typeof calculations> = {
      success: true,
      data: calculations
    };

    return res.json(response);
  } catch (error) {
    console.error('Error calculating joint evaluation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate joint evaluation'
    });
  }
};
